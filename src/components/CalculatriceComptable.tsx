
import React, { useState } from 'react';
import { Calculator, Divide, Minus, Plus, X, Equal, Percent, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UltraCard } from '@/components/ui/ultra-card';

interface CalculatriceComptableProps {
  onClose?: () => void;
}

export const CalculatriceComptable = ({ onClose }: CalculatriceComptableProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setHistory(prev => [...prev, `${currentValue} ${operation} ${inputValue} = ${newValue}`]);
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue * (secondValue / 100);
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setHistory(prev => [...prev, `${previousValue} ${operation} ${inputValue} = ${newValue}`]);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const ButtonCalc = ({ 
    onClick, 
    children, 
    variant = 'outline', 
    className = '' 
  }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    variant?: 'outline' | 'default' | 'secondary';
    className?: string;
  }) => (
    <Button
      onClick={onClick}
      variant={variant}
      className={`h-12 text-lg font-semibold transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </Button>
  );

  return (
    <UltraCard 
      title="Calculatrice Comptable" 
      icon={<Calculator className="w-5 h-5" />}
      className="w-full max-w-md mx-auto"
    >
      <div className="space-y-4">
        {/* Display */}
        <div className="bg-muted/30 rounded-lg p-4 text-right">
          <div className="text-3xl font-bold text-primary min-h-[3rem] flex items-center justify-end">
            {display}
          </div>
          {operation && previousValue !== null && (
            <div className="text-sm text-muted-foreground">
              {previousValue} {operation}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-muted/20 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Historique</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-6 px-2 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {history.slice(-3).map((calc, index) => (
                <div key={index} className="text-xs text-muted-foreground font-mono">
                  {calc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <ButtonCalc onClick={clear} variant="secondary" className="bg-destructive/10 text-destructive">
            C
          </ButtonCalc>
          <ButtonCalc onClick={handlePercentage} className="text-primary">
            <Percent className="w-4 h-4" />
          </ButtonCalc>
          <ButtonCalc onClick={() => performOperation('÷')} className="text-primary">
            <Divide className="w-4 h-4" />
          </ButtonCalc>
          <ButtonCalc onClick={() => performOperation('×')} className="text-primary">
            <X className="w-4 h-4" />
          </ButtonCalc>

          {/* Row 2 */}
          <ButtonCalc onClick={() => inputNumber('7')}>7</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('8')}>8</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('9')}>9</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('-')} className="text-primary">
            <Minus className="w-4 h-4" />
          </ButtonCalc>

          {/* Row 3 */}
          <ButtonCalc onClick={() => inputNumber('4')}>4</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('5')}>5</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('6')}>6</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('+')} className="text-primary">
            <Plus className="w-4 h-4" />
          </ButtonCalc>

          {/* Row 4 */}
          <ButtonCalc onClick={() => inputNumber('1')}>1</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('2')}>2</ButtonCalc>
          <ButtonCalc onClick={() => inputNumber('3')}>3</ButtonCalc>
          <ButtonCalc 
            onClick={handleEquals} 
            variant="default"
            className="row-span-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Equal className="w-4 h-4" />
          </ButtonCalc>

          {/* Row 5 */}
          <ButtonCalc onClick={() => inputNumber('0')} className="col-span-2">0</ButtonCalc>
          <ButtonCalc onClick={inputDecimal}>.</ButtonCalc>
        </div>

        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Fermer
          </Button>
        )}
      </div>
    </UltraCard>
  );
};
