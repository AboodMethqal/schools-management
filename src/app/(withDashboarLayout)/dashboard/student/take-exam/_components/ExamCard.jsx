import { FileText, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const ExamCard = ({ exam, onJoinClick }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="group relative bg-bg-card rounded-[2.5rem] border border-border-light p-2 pb-8 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Decorative background element on hover */}
      <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
            <FileText size={32} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black bg-primary-light text-primary px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-primary/10">
              {exam.category || (isAr ? 'مميز' : 'Premium')}
            </span>
            {exam.questions?.length > 10 && (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-xl border border-orange-100 dark:border-orange-800/30 animate-pulse">
                <Sparkles size={12} fill="currentColor" /> {isAr ? 'شائع' : 'POPULAR'}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-text-primary mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {exam.roomTitle}
        </h3>

        <p className="text-text-secondary text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
          {isAr
            ? `أطلق إمكاناتك واختبر مهاراتك في ${exam.roomTitle}. مُعد باحترافية لمحاكاة الاختبارات الفعلية.`
            : `Unlock your potential by testing your skills in ${exam.roomTitle}. Curated by industry experts for real-world scenarios.`}
        </p>

        <div className="flex items-center justify-between py-5 border-t border-border-light mb-8">
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Users size={16} />
            </div>
            <span className="text-sm font-bold">
              {exam.questions?.length || 0} {isAr ? 'سؤالاً' : 'Questions'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Clock size={16} />
            </div>
            <span className="text-sm font-bold">30 {isAr ? 'دقيقة' : 'Mins'}</span>
          </div>
        </div>

        <button
          onClick={() => onJoinClick(exam.roomCode)}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-slate-900 text-white text-base font-black group-hover:bg-primary transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-slate-950/60 group-hover:shadow-primary/30 active:scale-95"
        >
          {isAr ? 'بدء الاختبار' : 'Start Assessment'}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
