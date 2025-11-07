'use client';

import './page.css';
import { useContext, useEffect, useState } from 'react';
import { useDashboard } from '@/data/hooks/useDashboard';
import { StatisticCard } from '@/components/StatisticCard';
import {
  IconCalendarMonth,
  IconChartBar,
  IconChartBarOff,
  IconCurrencyDollar,
  IconTool,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Message } from '@/components/Message';
import { Format } from '@/utils/Format';
import { Search } from '@/components/Search';
import { Transaction } from '@/models/Transaction';
import { baseURL } from '@/utils/api';
import { Auth } from '@/data/contexts/Auth';

export default function Home() {

  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const {
    getTotalTransactions,
    getRevenues,
    getExpense,
    getTotalPay,
    getTotalReceive,
    getTotalToPay,
    getTotalToReceive,
    message,
    status,
    activeMessage,
  } = useDashboard();

  const { push } = useRouter();


  function redirectTo(url: string) {
    setTimeout(() => {
      push(url);
    }, 3000);
  }

  const revenue = getRevenues();
  const expense = getExpense();
  const totalPay = getTotalPay();
  const totalReceive = getTotalReceive();
  const getToPay = getTotalToPay();
  const getToReceive = getTotalToReceive();

  useEffect(() => {
    const total = getTotalTransactions();
    setTotalTransactions(total);
  }, [getTotalTransactions]);

  return (
    <main className='container-main'>
      <Message
        message={message}
        status={status}
        activeMessage={activeMessage}
      />
      <Search />
      <section className='statistics'>
        <StatisticCard
          total={Format.formatPrice(totalTransactions)}
          description='Total em transações'
          icon={<IconTool />}
        />
        <StatisticCard
          total={Format.formatPrice(revenue)}
          description='Receitas'
          icon={<IconChartBar style={{ color: 'greenyellow' }} />}
        />
        <StatisticCard
          total={Format.formatPrice(expense)}
          description='Despesas'
          icon={<IconChartBarOff style={{ color: 'red' }} />}
        />
        <StatisticCard
          total={Format.formatPrice(totalPay)}
          description='Total pago'
          icon={<IconCurrencyDollar />}
        />
        <StatisticCard
          total={Format.formatPrice(totalReceive)}
          description='Total recebido'
          icon={<IconCurrencyDollar />}
        />
        <StatisticCard
          total={Format.formatPrice(getToPay)}
          description='Total a ser pago'
          icon={<IconCurrencyDollar />}
        />
        <StatisticCard
          total={Format.formatPrice(getToReceive)}
          description='Total a ser recebido'
          icon={<IconCurrencyDollar />}
        />
      </section>
      <StatisticCard
        total={1200}
        description='Este mes'
        icon={<IconCalendarMonth />}
      />
    </main>
  );
}
