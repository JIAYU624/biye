import React, { useState, useEffect, useMemo } from 'react';
import { Download, ArrowUp, GraduationCap } from 'lucide-react';

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>;
  }
}

interface TeacherMessage {
  id: string;
  name: string;
  title: string;
  category: string;
  content: string;
  avatar: string;
  image?: string; // 可選：書法/手寫圖片
}

const TEACHER_MESSAGES: TeacherMessage[] = [
  // 前四位固定順序
  { id: 'msg-08', name: '朱崇科', title: '专业教师', category: '专业教师', content: '多未雨绸缪，少拖延磨蹭；\n有轻重缓急，毋是非不分；\n敢放手一搏，宜能屈能伸。\n——祝2026届毕业生前程似锦', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ZhuChongKe&backgroundColor=fed7aa' },
  { id: 'msg-01', name: '郑哲', title: '党政教师', category: '党政教师', content: '愿2026届的文珠学子，以"博学审问"拓宽人生边界，以"慎思明辨"守正中文风骨，以"笃行不怠"回应时代呼唤。去日不可追，来日犹可期，祝大家前程似锦，顶峰相见！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ZhengZhe&backgroundColor=e2e8f0' },
  { id: 'msg-09', name: '贾智', title: '专业教师', category: '专业教师', content: '在文珠，读经典、养文气、立风骨。愿君做温润有力的文珠人，眼里有光、脚下有路。愿君在未来的旅程中，如星辰般璀璨，每一段追求都充满力量。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JiaZhi&backgroundColor=a7f3d0' },
  { id: 'msg-02', name: '沈锐', title: '党政教师', category: '党政教师', content: '出书斋一言一行皆学问', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ShenRui&backgroundColor=bae6fd' },
  // 党政教师（其余）
  { id: 'msg-03', name: '陈必芳', title: '党政教师', category: '党政教师', content: '又逢离别时节，过往光景，鲜活依旧，惹人感念。几度春秋相伴，有同学得遂心意，有人仍寻本心，无妨，人生征途本就往复向前。愿同学们谨记校训，以追求卓越作行囊，长存文珠人开拓、勇往直前的风骨，在往后的日子里，劈波斩浪，一往无前。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChenBiFang&backgroundColor=a7f3d0' },
  { id: 'msg-04', name: '王颜玉', title: '党政教师', category: '党政教师', content: '万卷书读过了，该行万里路了！祝大家在广阔世界经营灿烂人生，前途似海，来日方长，欢迎常回文珠看看', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=WangYanYu&backgroundColor=fef08a' },
  { id: 'msg-05', name: '王轲', title: '党政教师', category: '党政教师', content: '愿同学们带着深厚人文积淀奔赴崭新征程，紧扣国家发展需求，不断精进学识、锤炼本领，成长为复合型文科人才。把个人理想融入时代大局，以所学所长回馈社会，奋力书写无愧于青春、无愧于家国的人生答卷。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=WangKe&backgroundColor=fed7aa' },
  { id: 'msg-06', name: '毛可欣', title: '党政教师', category: '党政教师', content: '此去乘风，文心不改；行而不辍，未来可期。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=MaoKeXin&backgroundColor=e2e8f0' },
  { id: 'msg-07', name: '武若芸', title: '党政教师', category: '党政教师', content: '谨祝各位同学健康快乐、心想事成！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=WuRuoYun&backgroundColor=bae6fd' },
  // 专业教师（其余）
  { id: 'msg-10', name: '许云和', title: '专业教师', category: '专业教师', content: '愉快地走向新的生活出发点', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=XuYunHe&backgroundColor=fef08a' },
  { id: 'msg-11', name: '魏朝勇', title: '专业教师', category: '专业教师', content: '祝愿同学们未来能够过上一种真正属己的美好生活！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=WeiChaoYong&backgroundColor=e2e8f0' },
  { id: 'msg-12', name: '杨蓓', title: '专业教师', category: '专业教师', content: '依稀记得四年前的网课，而如今已是毕业季。\n\n愿你们一如既往地走向变化中的可能，未知里的开阔。\n\n祝毕业快乐！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YangBei&backgroundColor=bae6fd' },
  { id: 'msg-13', name: '陈佳妮', title: '专业教师', category: '专业教师', content: '亲爱的文珠26届毕业生，祝贺你们顺利完成学业，毕业快乐！文珠记录了你们四年的无悔青春，也将见证你们未来的披荆斩棘。毕业并非结束，而是新征程的起点。"入学初识门庭，毕业非同学成；涉世或始今日，立身却在生平。"谨以启功先生的"毕业训"与诸君共勉！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChenJiaNi&backgroundColor=fed7aa' },
  { id: 'msg-14', name: '陈洁', title: '专业教师', category: '专业教师', content: '亲爱的同学们，又是一年毕业季，你们即将走出校门，经历一次次空间变迁，体验老师曾经讲授的城市空间与个人思想的变动。人的一生很长，但关键处只有几步，特别是青春年少的时候，希望你们能把握好人生的关键节点，运用所学，发挥才智，走出精彩纷呈的一生！成为最好的自己！祝愿所有的26届文珠毕业生前程似锦！生活美满！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ChenJie&backgroundColor=a7f3d0' },
  { id: 'msg-15', name: '李雪莲', title: '专业教师', category: '专业教师', content: '跟大家分享我今年读到的奥登的几句诗吧，"但愿我，虽然跟他们一样/由厄洛斯和尘土构成，/被同样的消极/和绝望围困，能呈上/一柱肯定的火焰"，但愿我们都能呈上"一柱肯定的火焰"。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=LiXueLian&backgroundColor=fef08a' },
  { id: 'msg-xu', name: '徐俊刚', title: '专业教师', category: '专业教师', content: '坦塗奈樂，靈兮自藏', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=XuJunGang&backgroundColor=d1fae5', image: '/xu-jungang.jpg' },
  { id: 'msg-16', name: '邱晓丹', title: '专业教师', category: '专业教师', content: '亲爱的2026届文珠学子们：当你们在2026年夏天合上本科时代最后一页，世界或许正翻开新的篇章。请你们带着文学赋予你们的眼光，走向更广阔的人生。请记得，叙事的力量永远在于对抗遗忘与简化。愿你们成为复杂意义的守护者，在众声喧哗中依然关心细微的情感。愿你们拥有鲁迅式的清醒与锋芒，也有托尔斯泰式的悲悯与追问，还有莎士比亚式的丰富与洞察。愿你们用人生书写一部部属于你们自己的宏大篇章。毕业快乐，前程似锦！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=QiuXiaoDan&backgroundColor=e2e8f0' },
  { id: 'msg-17', name: '洪晓纯', title: '专业教师', category: '专业教师', content: '理想为翼，情怀作骨。行无悔之事，修有节之身。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=HongXiaoChen&backgroundColor=bae6fd' },
  { id: 'msg-18', name: '胡星灿', title: '专业教师', category: '专业教师', content: '庄敬日强，安肆日偷。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=HuXingCan&backgroundColor=fed7aa' },
  { id: 'msg-19', name: '吉云飞', title: '专业教师', category: '专业教师', content: '不要一直被恐惧驱赶着去行动，你们比自己想象中更安全也有更多的自由。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JiYunFei&backgroundColor=a7f3d0' },
  { id: 'msg-20', name: '刘杰', title: '专业教师', category: '专业教师', content: '这是一个潮水般变幻的时代。但请相信，技术能拓展视野，而你们感知美的灵性不可替代。愿大家拥抱变化，心中有诗，前路有光。毕业快乐！祝大家一切顺利，前程似锦！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=LiuJie&backgroundColor=fef08a' },
  { id: 'msg-21', name: '许树妙', title: '专业教师', category: '专业教师', content: '祝愿2022级同学毕业快乐！在新的人生旅途一路高歌，鹏程万里。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=XuShuMiao&backgroundColor=e2e8f0' },
  { id: 'msg-22', name: '杨蓥莹', title: '专业教师', category: '专业教师', content: '阶段性的陪伴,也可以有一生难忘的回忆。对未知的生活总要抱有期待，对过去的岁月在心里对自己说一声感谢。祝福大家毕业快乐！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YangYingYing&backgroundColor=bae6fd' },
  { id: 'msg-23', name: '谭菲', title: '专业教师', category: '专业教师', content: '四年的研读生活里，你们在一本又一本充满陌生化语言的书籍中沉潜、辨析、成长。那些陌生化的语言，乍看像是远离生活的抽象概念或夸张表达，但它们其实深深扎根于日常经验之中。每个人在成长的某些时刻，都会真切地感受到困惑、未知与难以言说，也会意识到日常语言的逼仄与有限。正是在情绪最浓烈、思考最迫切的地方，陌生化语言开始出现：它可以有各种各样的人间姓名——可以是文学，也可以是理论。愿你们带着自己的经验、感受与判断继续出发，在未来的道路上，始终保有向经验发问的热情；愿文学与理论如两条隐秘的河流，陪伴你们穿过日常的褶皱，在经验深处听见世界重新展开的声音。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=TanFei&backgroundColor=fed7aa' },
  { id: 'msg-24', name: '代云芳', title: '专业教师', category: '专业教师', content: '人生这出大戏，我们都在场上，光可以自己打，话筒可以手工搓，唱便是了！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=DaiYunFang&backgroundColor=a7f3d0' },
  { id: 'msg-25', name: '靳一凡', title: '专业教师', category: '专业教师', content: '祝文珠2026届毕业生\n既有前程可奔赴，亦有岁月可回首。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JinYiFan&backgroundColor=fef08a' },
  { id: 'msg-26', name: '叶跃武', title: '专业教师', category: '专业教师', content: '毕业意味着告别，也意味着珍藏记忆。愿你们走向更广阔的人生，也记得曾一起走过的人。愿你们在人生路上，既追求光亮，也守护脆弱；既善待自己，也珍惜相遇。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YeYueWu&backgroundColor=e2e8f0' },
  { id: 'msg-27', name: '赵颖秋', title: '专业教师', category: '专业教师', content: '想和大家分享韩剧《所有人都在与自己的无价值作斗争》里的一个设定——剧中有块"情绪手表"，戴在手腕上可以识别和命名当下的感受。红色代表不安和愤怒，绿色代表幸福和平静，当无法识别的时候，会亮出「未知」二字。毕业后的人生里，我们大概免不了会碰到很多连情绪手表也无法命名的时刻。茫然当中，不妨多去公园散步，继续翻喜欢的书，保持最低限度的社交。祝大家毕业快乐，继续保有简洁的勇气，让未知成为一种可以携带着共存的自然状态。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ZhaoYingQiu&backgroundColor=bae6fd' },
  { id: 'msg-28', name: '黄琳', title: '专业教师', category: '专业教师', content: '"有工夫读书，谓之福；有力量济人，谓之福；有学问著述，谓之福；无是非到耳，谓之福；有多闻、直、谅之友，谓之福。"（张潮《幽梦影》）\n祝2026届的同学们五福骈臻，前程似海，来日方长！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=HuangLin&backgroundColor=fed7aa' },
  { id: 'msg-29', name: '蒋浩然', title: '专业教师', category: '专业教师', content: '若海的微澜，推远了初夏的流云，\n凤凰山的草木，又深了一层青绿。\n当行囊打点妥当，\n别忘了再装上几两唐家湾的晚风。此去人海茫茫，步履或有匆忙，\n若遇上无星无月的长夜，\n愿这阵风，能替你翻开案头的旧书。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JiangHaoRan&backgroundColor=a7f3d0' },
  { id: 'msg-30', name: '金大一', title: '专业教师', category: '专业教师', content: '亲爱的毕业生们，大家好！首先，真心祝贺你们！想起你们走过的路，我感慨万千。那些在图书馆熬夜的日子，发表前紧张的时刻，和朋友们一起分享的小小欢笑……所有这些瞬间，都成就了现在的你们。这特别的四年，大家真的辛苦了。未来的人生不会总是一帆风顺。有时会遇到意想不到的路，也会迎来"这样对吗"的时刻。那时，请记住这两句话："步子小也没关系，只要不停下来就好。""迷路了，不代表没有路。"你们从来不是孤单一人。母校永远是你们坚实的后援团，无论何时，我们都会真心为你们的成功和成长感到高兴。最后，我想对你们说：愿你们平安，愿你们勇敢，愿你们拥有一个笑口常开的人生。为你们的未来送上无尽的祝福。再次真心祝贺你们毕业！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JinDaYi&backgroundColor=fef08a' },
  { id: 'msg-31', name: '李柏林', title: '专业教师', category: '专业教师', content: '人生中一大问题是所择取。青年须有这个见地：形而下的学问西方有其优长，而形而上的学问，即精神与安身立命之学问，中国古学所达到的精深透彻的高度，实有其不可替代之价值。青年要将这个文化命脉传承下去。至于生命的学问，须知生命是一个过程，青年幻想于爱情，中年汲汲于名利，面对这所有之事要有向上之心，亦要有豁达超然之胸怀，能事人，亦要能事天，能知世，亦要能知命。于物来顺应之中守护生命之本真，困惑之时，则不妨于古学之中寻求指引。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=LiBaiLin&backgroundColor=e2e8f0' },
  { id: 'msg-32', name: '李星雨', title: '专业教师', category: '专业教师', content: 'The scary news is you\'re on your own now.\n\nThe cool news is you\'re on your own now', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=LiXingYu&backgroundColor=bae6fd' },
  { id: 'msg-33', name: 'Roman Lashin (张力允)', title: '专业教师', category: '专业教师', content: '毕业不是终点，而是新征程的起点。愿你们带着文珠的记忆，向更远的地方出发。无论顺境逆境，都要记得：保持善良，坚持热爱，相信自己。祝你们毕业快乐！', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Roman&backgroundColor=fed7aa' },
  { id: 'msg-34', name: '万笛', title: '专业教师', category: '专业教师', content: '数载匆匆，相聚别离，明日启程，各赴山海，愿同学们以理想为地图，用坚持作脚步，写出更精彩的人生故事。', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=WanDi&backgroundColor=a7f3d0' },
];

const CATEGORIES = ['全部', '党政教师', '专业教师'];

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

    // 找到對應的訊息資料
    const msg = TEACHER_MESSAGES.find(m => m.id === cardId);
    if (!msg) { setDownloadingId(null); return; }

    // 動態建立下載專用豎版卡片
    const card = document.createElement('div');
    card.style.cssText = `
      position: fixed; left: -9999px; top: 0;
      width: 540px; min-height: 760px;
      background: linear-gradient(to bottom, #dde8f5 0%, #e8eff8 35%, #f0e8e4 70%, #ede0dc 100%);
      border: none;
      border-radius: 0;
      display: flex; flex-direction: column;
      font-family: 'Noto Serif SC', 'Source Han Serif CN', 'STSong', serif;
      box-sizing: border-box;
      overflow: hidden;
    `;

    // 頂部留白 + 粗線（侵蝕效果用 box-shadow 模擬）
    const topSpacer = document.createElement('div');
    topSpacer.style.cssText = 'width: 100%; height: 20px; flex-shrink: 0;';
    card.appendChild(topSpacer);

    const topBar = document.createElement('div');
    topBar.style.cssText = `
      width: 80%; height: 12px; flex-shrink: 0; margin: 0 auto;
      background: #4B3D3A;
      box-shadow: 2px 1px 0 #6b5550, -1px 2px 0 #3a2e2b, 3px -1px 0 #5a4642, -2px -1px 0 #4B3D3A;
      filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='e'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feDisplacementMap in='SourceGraphic' scale='3'/></filter></svg>#e");
    `;
    card.appendChild(topBar);

    // 內容區（帶 padding）
    const inner = document.createElement('div');
    inner.style.cssText = 'flex: 1; padding: 40px 44px 32px 44px; display: flex; flex-direction: column; box-sizing: border-box;';
    card.appendChild(inner);

    // 頂部資訊列：左側名字 + 右側豎排日期
    const topRow = document.createElement('div');
    topRow.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px;';

    // 左上角老師名字（豎排）
    const nameEl = document.createElement('div');
    nameEl.style.cssText = `
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 38px;
      font-weight: 900;
      color: #3F3A38;
      letter-spacing: 0.1em;
      line-height: 1.2;
    `;
    nameEl.textContent = teacherName;

    // 右上角豎排中文日期
    const now = new Date();
    const cnNums = ['〇','一','二','三','四','五','六','七','八','九'];
    const toCn = (n: number) => String(n).split('').map(d => cnNums[parseInt(d)]).join('');
    const year = toCn(now.getFullYear());   // e.g. 二〇二六
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const cnMonth = month <= 9 ? cnNums[month] : '十' + (month > 10 ? cnNums[month - 10] : '');
    const cnDay = day < 10 ? cnNums[day] : (day === 10 ? '十' : (day < 20 ? '十' + cnNums[day - 10] : (day === 20 ? '二十' : '二十' + cnNums[day - 20])));
    const dateText = `${year}年·${cnMonth}月·${cnDay}日`;

    const dateEl = document.createElement('div');
    dateEl.style.cssText = `
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 15px;
      color: #3F3A38;
      letter-spacing: 0.15em;
      line-height: 1.8;
      padding-top: 4px;
    `;
    dateEl.textContent = `${year}年 六月 二十五日`;

    topRow.appendChild(nameEl);
    topRow.appendChild(dateEl);
    inner.appendChild(topRow);

    // 寄語內容
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      flex: 1;
      font-size: 22px;
      line-height: 2;
      color: #3F3A38;
      letter-spacing: 0.05em;
      text-align: justify;
      margin-bottom: 32px;
      padding-right: 40px;
      white-space: pre-wrap;
    `;
    if (msg.image) {
      const imgEl = document.createElement('img');
      imgEl.src = msg.image;
      imgEl.style.cssText = 'width: 100%; border-radius: 0; object-fit: contain;';
      contentDiv.appendChild(imgEl);
    } else {
      contentDiv.textContent = msg.content;
    }
    inner.appendChild(contentDiv);

    // 分隔線
    const hr = document.createElement('div');
    hr.style.cssText = 'height: 1px; background: #c5d8f0; margin-bottom: 20px;';
    inner.appendChild(hr);

    // 底部：logo 居左
    const footer = document.createElement('div');
    footer.style.cssText = 'display: flex; align-items: center; justify-content: flex-start;';
    const footerLogo = document.createElement('img');
    footerLogo.src = '/logo.png';
    footerLogo.style.cssText = 'height: 28px; object-fit: contain;';
    footer.appendChild(footerLogo);
    inner.appendChild(footer);

    // 底部粗線（侵蝕效果）+ 留白
    const bottomBar = document.createElement('div');
    bottomBar.style.cssText = `
      width: 80%; height: 12px; flex-shrink: 0; margin: 0 auto;
      background: #4B3D3A;
      box-shadow: 2px 1px 0 #6b5550, -1px 2px 0 #3a2e2b, 3px -1px 0 #5a4642, -2px -1px 0 #4B3D3A;
      filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='e'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feDisplacementMap in='SourceGraphic' scale='3'/></filter></svg>#e");
    `;
    card.appendChild(bottomBar);

    const bottomSpacer = document.createElement('div');
    bottomSpacer.style.cssText = 'width: 100%; height: 20px; flex-shrink: 0;';
    card.appendChild(bottomSpacer);

    document.body.appendChild(card);

    // 等待圖片載入
    const imgs = card.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
    ));

    try {
      const canvas = await window.html2canvas(card, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `毕业寄语-${teacherName}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      document.body.removeChild(card);
      setDownloadingId(null);
    }
  };

  const messages = TEACHER_MESSAGES ?? [];
  const filteredMessages = activeCategory === '全部' ? messages : messages.filter(msg => msg.category === activeCategory);

  // 紙飛機 Canvas 動畫
  useEffect(() => {
    const canvas = document.getElementById('plane-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const img = new Image();
    img.src = '/plane.png';

    interface Plane {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      angle: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      t: number;
    }

    const planes: Plane[] = [];
    const COUNT = 10;

    const spawnPlane = (): Plane => {
      const fromLeft = Math.random() > 0.5;
      const size = 36 + Math.random() * 32;
      const speed = 0.6 + Math.random() * 0.8;
      const angle = (Math.random() - 0.5) * 0.5; // 飛行方向偏角
      const vx = fromLeft ? speed : -speed;
      const vy = (Math.random() - 0.5) * 0.4;
      return {
        x: fromLeft ? -size : canvas.width + size,
        y: Math.random() * canvas.height,
        vx, vy,
        size,
        angle: fromLeft ? angle : Math.PI + angle,
        opacity: 0.5 + Math.random() * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        wobbleAmp: 0.3 + Math.random() * 0.5,
        t: 0,
      };
    };

    for (let i = 0; i < COUNT; i++) {
      const p = spawnPlane();
      // 初始位置散佈全頁
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      planes.push(p);
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      planes.forEach((p, i) => {
        p.t += 1;
        p.wobble += p.wobbleSpeed;
        // 不規則軌跡：在 vy 上疊加正弦波動
        const curVy = p.vy + Math.sin(p.wobble) * p.wobbleAmp;
        p.x += p.vx;
        p.y += curVy;

        // 飛出畫面後重置
        if (p.x < -p.size * 2 || p.x > canvas.width + p.size * 2 ||
            p.y < -p.size * 2 || p.y > canvas.height + p.size * 2) {
          planes[i] = spawnPlane();
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.globalCompositeOperation = 'multiply';
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle + Math.sin(p.wobble * 0.7) * 0.15);
        ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    img.onload = () => { draw(); };
    if (img.complete) draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800" style={{ backgroundColor: '#D7E4F7', position: 'relative' }}>
      <style>{`
        .card-watermark { display: none; }
        @keyframes twinkle {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
        .deco-star { animation: twinkle var(--dur) var(--delay) ease-in-out infinite; }
      `}</style>

      {/* 紙飛機 Canvas —— 鋪在整頁背景，卡片在其上方 */}
      <canvas
        id="plane-canvas"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 0 }}
      />

      {/* 首頁 Hero —— 手機豎版 / 電腦橫版 */}
      <section className="relative flex flex-col items-center justify-end bg-center bg-no-repeat"
        style={{ zIndex: 1, minHeight: '100svh' }}
      >
        {/* 電腦版背景 */}
        <div className="absolute inset-0 hidden md:block bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.png)', backgroundSize: '80%' }} />
        {/* 手機版背景 */}
        <div className="absolute inset-0 block md:hidden bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-mobile.png)', backgroundSize: 'contain' }} />

        <div
          className="relative z-10 mb-10 flex flex-col items-center text-slate-600 hover:text-blue-500 transition-colors cursor-pointer animate-bounce"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm tracking-widest mb-2 font-medium">开启时光信箱</span>
          <ArrowUp className="w-5 h-5 rotate-180" />
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-16">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 md:px-6 py-2 rounded-full transition-all border text-sm md:text-base ${activeCategory === cat ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-500 border-transparent hover:bg-blue-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {filteredMessages.map(msg => (
            <div key={msg.id} id={msg.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col border border-slate-100 transition-transform hover:-translate-y-2 download-border">
              <div className="flex-grow mb-6 md:mb-8 text-slate-700 leading-loose text-justify text-sm md:text-base">
                {msg.image
                  ? <img src={msg.image} alt={`${msg.name}手写寄语`} className="w-full rounded-xl object-contain max-h-72" />
                  : msg.content
                }
              </div>
              <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">{msg.name}</h3>
                <button onClick={() => handleDownload(msg.id, msg.name)} className="download-btn p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white transition-all">
                  {downloadingId === msg.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={18} />}
                </button>
              </div>
              <div className="card-watermark mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
                <img src="/logo.png" alt="中山大学中文系（珠海）" className="h-8 object-contain" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* 頁面底部 */}
      <div style={{ position: 'relative', zIndex: 1 }} className="py-8 md:py-10 flex justify-center">
        <img src="/footer.png" alt="中文系（珠海）2026年毕业季系列活动" style={{ mixBlendMode: 'multiply', maxWidth: '480px', width: '85%' }} />
      </div>
    </div>
  );
}
