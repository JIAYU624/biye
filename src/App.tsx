import React, { useState, useEffect } from 'react';
import { Download, ArrowUp, GraduationCap } from 'lucide-react';

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>;
  }
}

const TEACHER_MESSAGES = [
  { id: 'msg-01', name: '郑哲', title: '系领导 / 教授', category: '系领导', content: '亲爱的 2026 届同学们，你们即将完成学业，开启人生新的篇章，希望你们始终铭记"博学、审问、慎思、明辨、笃行"的校训，以专业精神服务社会，以创新勇气应对挑战，更要以家国情怀锚定人生坐标。无论未来选择深耕行业、扎根基层或继续深造，始终永葆求知热忱，在时代浪潮中既脚踏实地，亦心怀星河。中文（珠海）永远是你们的精神港湾！愿此去繁花似锦，归来仍是少年！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zheng&backgroundColor=e2e8f0' },
  { id: 'msg-02', name: '周建渝', title: '专业课教师', category: '专业教师', content: '无论你今后走多远，或成功，或受挫，文珠永远是你力量的源泉，心灵的港湾。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zhou&backgroundColor=fef08a' },
  { id: 'msg-03', name: '高静', title: '专业课教师', category: '专业教师', content: '亲爱的同学们：恭喜你们顺利毕业！非常荣幸见证你们的成长，也祝你们在人生的新征程中扬帆起航，不断超越！此去山高路远，愿你们始终保持对现实的智性审视，既做生活的阐释者，也做理想的建构者，在数据洪流中锚定意义生成的坐标系，让文学的星群永远照亮精神的旷野。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Gao&backgroundColor=fed7aa' },
  { id: 'msg-04', name: '陈佳妮', title: '班主任', category: '班主任', content: '首先热烈祝贺22级本科生顺利毕业，诚挚地祝福你们未来之路光辉灿烂！我谨以启功先生题写的毕业训与大家共勉："入学初识门庭，毕业非同学成；涉事或始今日，立身却在生平。"祝大家毕业快乐！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChenJ&backgroundColor=bae6fd' },
  { id: 'msg-05', name: '陈洁', title: '辅导员', category: '辅导员', content: '海阔凭鱼跃，天高任鸟飞。祝愿26届文珠毕业生们前程似锦！生活美满！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChenJie&backgroundColor=a7f3d0' }
];

const CATEGORIES = ['全部', '系领导', '专业教师', '班主任', '辅导员'];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleDownload = async (cardId: string, teacherName: string) => {
    if (!window.html2canvas) return;
    setDownloadingId(cardId);
    const element = document.getElementById(cardId) as HTMLElement;
    const downloadBtn = element.querySelector<HTMLElement>('.download-btn');
    const watermark = element.querySelector<HTMLElement>('.card-watermark');
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (watermark) watermark.style.display = 'flex';
    try {
      const canvas = await window.html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `毕业寄语-${teacherName}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      if (downloadBtn) downloadBtn.style.display = 'flex';
      if (watermark) watermark.style.display = 'none';
      setDownloadingId(null);
    }
  };

  const messages = TEACHER_MESSAGES ?? [];
  const filteredMessages = activeCategory === '全部' ? messages : messages.filter(msg => msg.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      <style>{`
        .card-watermark { display: none; }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shine-text {
          background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shine 4s linear infinite;
        }
      `}</style>

      <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#fef08a]/20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 italic serif animate-pulse">
          <span className="shine-text">师语寄韶华</span>
        </h1>
        <p className="text-lg text-slate-600 mb-16 tracking-[0.2em] font-light">CLASS OF 2026 · GRADUATION</p>

        <div
          className="absolute bottom-12 flex flex-col items-center text-slate-400 hover:text-blue-500 transition-colors cursor-pointer animate-bounce"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm tracking-widest mb-2 font-medium">开启时光信箱</span>
          <ArrowUp className="w-5 h-5 rotate-180" />
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full transition-all border ${activeCategory === cat ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-500 border-transparent hover:bg-blue-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMessages.map(msg => (
            <div key={msg.id} id={msg.id} className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col border border-slate-100 relative overflow-hidden transition-transform hover:-translate-y-2">
              <div className="flex-grow mb-8 text-slate-700 leading-loose text-justify">{msg.content}</div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100"><img src={msg.avatar} alt={msg.name} className="w-full h-full object-cover" /></div>
                  <div><h3 className="font-bold text-slate-800">{msg.name}老师</h3><p className="text-xs text-slate-400">{msg.title}</p></div>
                </div>
                <button onClick={() => handleDownload(msg.id, msg.name)} className="download-btn p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all">
                  {downloadingId === msg.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={18} />}
                </button>
              </div>
              <div className="card-watermark absolute bottom-0 left-0 w-full h-12 bg-blue-50 flex items-center justify-center space-x-2 text-blue-400/80 text-xs tracking-widest border-t border-blue-100/50">
                <GraduationCap size={14} /><span>2026届毕业季 · 中文（珠海）</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
