import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Mail, X, Check } from 'lucide-react';

interface UpdatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdatesDialog({ isOpen, onClose }: UpdatesDialogProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border-black/10 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-medium">ติดตามข่าวสาร มหาiDea</DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">สมัครรับข่าวสารเรียบร้อย!</h3>
              <p className="text-black/60">เราจะส่งข่าวสารล่าสุดให้คุณเร็วๆ นี้</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-black/60 text-sm">
                ติดตามเพื่อรับข้อมูลข่าวสารเกี่ยวกับโครงการล่าสุด และกิจกรรมต่างๆ ของเรา
              </p>

              <div className="space-y-2">
                <Label htmlFor="subscribe-email" className="text-sm font-medium">
                  อีเมล
                </Label>
                <Input
                  id="subscribe-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="border-black/20 focus:border-black focus:ring-black/20 rounded-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 text-base font-medium transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังสมัคร...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ติดตาม
                  </span>
                )}
              </Button>

              <p className="text-xs text-black/40 text-center">
                เมื่อกดติดตาม คุณยอมรับที่จะรับอีเมลข่าวสารจาก มหาiDea (ยกเลิกได้ตลอดเวลา)
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
