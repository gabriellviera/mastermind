import { Plus, Edit, Trash, Video, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function AdminCourses() {
  // Mock Data for Admin
  const [courses, setCourses] = useState([
    { id: 1, title: 'Mentalidad de Tiburón', price: 99, lessons: 12, sales: 124 },
    { id: 2, title: 'Marketing Elite', price: 149, lessons: 24, sales: 89 },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
       <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-black italic">GESTIÓN DE <span className="text-neon-blue">CURSOS</span></h1>
           <button className="bg-neon-green text-black font-black px-6 py-3 rounded-xl hover:bg-[#2bff00] transition-colors flex items-center gap-2 shadow-lg shadow-neon-green/20">
               <Plus size={20} /> Nuevo Curso
           </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* COURSE LIST */}
           <div className="lg:col-span-2 space-y-4">
               {courses.map(course => (
                   <div key={course.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                       <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center">
                               <ImageIcon className="text-gray-600" />
                           </div>
                           <div>
                               <h3 className="font-bold text-lg text-white">{course.title}</h3>
                               <p className="text-sm text-gray-500">{course.lessons} Lecciones • {course.sales} Ventas</p>
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit size={18} /></button>
                           <button className="p-2 hover:bg-white/10 rounded-lg text-red-500"><Trash size={18} /></button>
                       </div>
                   </div>
               ))}
           </div>

           {/* EDITOR PREVIEW (Mock) */}
           <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit">
               <h3 className="font-bold text-lg mb-4">Editando: Nuevo Curso</h3>
               
               <div className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Título del Curso</label>
                       <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-neon-blue outline-none" />
                   </div>
                   
                   <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Video de Introducción</label>
                        <div className="border border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 cursor-pointer transition-colors">
                            <Video className="mx-auto text-gray-500 mb-2" />
                            <span className="text-xs font-bold text-gray-400">Subir al Bucket (Supabase)</span>
                        </div>
                   </div>
                   
                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Precio ($)</label>
                       <input type="number" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-neon-blue outline-none" />
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
}
