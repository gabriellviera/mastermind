-- Create a table for public profiles if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Toggle Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on public.profiles
  for update using ((select auth.uid()) = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, role)
  values (
     new.id, 
     new.email, 
     new.raw_user_meta_data->>'username', 
     new.raw_user_meta_data->>'full_name',
     'student' -- Default role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Table for Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table for User Enrollments
create table if not exists public.enrollments (
  user_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

-- Analytics Table
create table if not exists public.analytics (
  id uuid default gen_random_uuid() primary key,
  event_type text not null, -- 'page_view', 'add_to_cart', 'checkout_start', 'purchase'
  page_path text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Analytics
alter table public.analytics enable row level security;

-- Allow anonymous inserts for analytics (public tracking)
create policy "Allow anonymous analytics insert" on public.analytics
  for insert with check (true);

-- Allow admins to view analytics
create policy "Admins can view analytics" on public.analytics
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Storage Buckets (Setup instructions)
-- insert into storage.buckets (id, name, public) values ('course-content', 'course-content', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'course-content' );
-- create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'course-content' and (select role from public.profiles where id = auth.uid()) = 'admin' );

-- ============================================
-- COMMENTS TABLE
-- ============================================

-- Table for Course Comments
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  comment_text text not null,
  likes integer default 0,
  admin_reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies for comments
create policy "Anyone can view comments" on public.comments
  for select using (true);

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = user_id);

create policy "Admins can update any comment (for replies)" on public.comments
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Users and admins can delete comments" on public.comments
  for delete using (
    auth.uid() = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Create index for performance
create index if not exists comments_course_id_idx on public.comments(course_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
