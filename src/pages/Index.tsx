import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Section = 'home' | 'casino' | 'balance' | 'withdraw' | 'referral' | 'about';

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

  const quickBets = [100, 500, 1000, 5000, 10000, 100000];

  const startGame = () => {
    if (bet > balance) {
      toast.error('Недостаточно средств!');
      return;
    }

    setIsPlaying(true);
    setGameResult(null);
    setMultiplier(1.0);
    setBalance(balance - bet);

    const interval = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + 0.1;
        if (newMultiplier >= 10) {
          clearInterval(interval);
          setIsPlaying(false);
          setGameResult('lose');
          toast.error('Ракета улетела! Вы проиграли.');
          return prev;
        }
        return newMultiplier;
      });
    }, 100);
  };

  const cashOut = () => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    const winAmount = Math.floor(bet * multiplier);
    setBalance(balance + winAmount);
    setGameResult('win');
    toast.success(`Поздравляем! Вы выиграли ${winAmount}₽`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <div className="container max-w-md mx-auto px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-primary text-glow mb-2">🚀 RocketPay</h1>
          <p className="text-sm text-muted-foreground">Игровой бот с мгновенными выплатами</p>
        </header>

        <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as Section)} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-card/50 backdrop-blur-sm p-1">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" size={18} />
            </TabsTrigger>
            <TabsTrigger value="casino" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Rocket" size={18} />
            </TabsTrigger>
            <TabsTrigger value="balance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Wallet" size={18} />
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ArrowDownToLine" size={18} />
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" size={18} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 glow">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">Привет, друзья! 🌟</h2>
                <p className="text-foreground leading-relaxed">
                  У нас отличная новость! Вы можете получить <span className="font-bold text-primary">500 ₽</span> от нас 
                  и еще <span className="font-bold text-secondary">500 ₽</span> от Альфа-Банка! 
                  В итоге ваша сумма составит <span className="text-2xl font-bold text-glow">1000 ₽</span>!
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-primary/20">
              <h3 className="font-bold text-lg text-primary">Что нужно сделать?</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">1.</span>
                  <span>Оформить Альфа-Карту по ссылке</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">2.</span>
                  <span>Активировать карту в приложении</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">3.</span>
                  <span>Сделать покупку от 200 ₽. Отправить чек в @Alfa_Bank778 для выплаты 500 ₽</span>
                </li>
              </ol>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow">
                <Icon name="CreditCard" size={20} className="mr-2" />
                Оформить Альфа-Карту
              </Button>
            </Card>

            <Card className="p-4 bg-secondary/10 border-secondary/30">
              <p className="text-sm text-center">
                Альфа-Карта предлагает <span className="font-bold text-secondary">бесплатное обслуживание</span>, 
                кэшбэк каждый месяц и множество классных предложений! ❤️
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="casino" className="space-y-4 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="text-center space-y-6">
                <div className="relative h-48 flex items-center justify-center">
                  {!isPlaying && !gameResult && (
                    <div className="text-6xl animate-pulse-glow">🚀</div>
                  )}
                  {isPlaying && (
                    <div className="text-6xl animate-bounce">🚀</div>
                  )}
                  {gameResult === 'lose' && (
                    <div className="text-6xl opacity-30">💥</div>
                  )}
                  {gameResult === 'win' && (
                    <div className="text-6xl">🎉</div>
                  )}
                </div>

                {isPlaying && (
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-primary text-glow">
                      {multiplier.toFixed(1)}x
                    </div>
                    <p className="text-sm text-muted-foreground">Ваш выигрыш: {Math.floor(bet * multiplier)}₽</p>
                  </div>
                )}

                {gameResult && (
                  <div className="text-3xl font-bold text-glow">
                    {gameResult === 'win' ? '🎊 Победа!' : '💔 Проигрыш'}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ставка: {bet}₽</label>
                <div className="grid grid-cols-3 gap-2">
                  {quickBets.map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setBet(amount)}
                      className={bet === amount ? 'border-primary bg-primary/20' : ''}
                      disabled={isPlaying}
                    >
                      {amount >= 1000 ? `${amount / 1000}k` : amount}₽
                    </Button>
                  ))}
                </div>
              </div>

              {!isPlaying && !gameResult && (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 glow"
                  onClick={startGame}
                >
                  <Icon name="Rocket" size={24} className="mr-2" />
                  Запустить ракету
                </Button>
              )}

              {isPlaying && (
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 glow-cyan animate-pulse-glow"
                  onClick={cashOut}
                >
                  <Icon name="DollarSign" size={24} className="mr-2" />
                  Забрать {Math.floor(bet * multiplier)}₽
                </Button>
              )}

              {gameResult && (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                  onClick={() => {
                    setGameResult(null);
                    setMultiplier(1.0);
                  }}
                >
                  Играть снова
                </Button>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-4 animate-fade-in">
            <Card className="p-8 text-center bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 glow">
              <p className="text-sm text-muted-foreground mb-2">Ваш баланс</p>
              <p className="text-5xl font-bold text-primary text-glow">{balance}₽</p>
            </Card>

            <Card className="p-6 space-y-4 border-primary/20">
              <h3 className="font-bold text-lg text-primary">История операций</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Plus" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Пополнение</p>
                      <p className="text-xs text-muted-foreground">29 окт, 15:30</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">+1000₽</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4 animate-fade-in">
            <Card className="p-6 space-y-4 border-primary/20">
              <h3 className="font-bold text-lg text-primary">Вывод средств</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Сумма вывода</label>
                  <input
                    type="number"
                    placeholder="Введите сумму"
                    className="w-full p-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Номер карты</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full p-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 glow">
                  <Icon name="Send" size={20} className="mr-2" />
                  Вывести средства
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Минимальная сумма вывода: 500₽<br />
                  Комиссия: 0%
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="referral" className="space-y-4 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 glow">
              <div className="text-center space-y-3">
                <div className="text-4xl">👥</div>
                <h3 className="font-bold text-xl text-primary">Реферальная программа</h3>
                <p className="text-3xl font-bold text-glow">200₽</p>
                <p className="text-sm text-muted-foreground">за каждого друга</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-primary/20">
              <div>
                <label className="text-sm font-medium mb-2 block">Ваша реферальная ссылка</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://t.me/rocketpay_bot?start=ref123"
                    readOnly
                    className="flex-1 p-3 rounded-lg bg-muted border border-border text-sm"
                  />
                  <Button 
                    variant="outline" 
                    className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText('https://t.me/rocketpay_bot?start=ref123');
                      toast.success('Ссылка скопирована!');
                    }}
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Рефералов</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-secondary">0₽</p>
                  <p className="text-xs text-muted-foreground mt-1">Заработано</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
