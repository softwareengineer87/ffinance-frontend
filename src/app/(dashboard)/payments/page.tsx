'use client';

import './payments.css';
import { useDashboard } from '@/data/hooks/useDashboard';
import { Message } from '@/components/Message';
import { Payments } from '@/components/Payments';
import { Payment } from '@/models/Payment';
import { FormPayment } from '@/components/FormPayment';

function payments() {

  const {
    makePayment,
    payment,
    changePayment,
    getPayments,
    setPayments,
    payments,
    message,
    status,
    activeMessage
  } = useDashboard();

  async function handlePayment() {
    await makePayment(payment);
    const payments = await getPayments();
    setPayments(payments);
    changePayment(null);
  }

  return (
    <section className='payments-container'>
      <Message
        message={message}
        status={status}
        activeMessage={activeMessage}
      />
      <div className='payments'>
        <div className='header-payment'>
          <h2>Seus pagamentos</h2>
          <button
            className='btn-create'
            onClick={() => changePayment({} as Payment)}
          >
            Criar pagamento
          </button>
        </div>
        {payment ? (
          <FormPayment
            payment={payment}
            savePayment={handlePayment}
            changePayment={changePayment}
            cancell={() => changePayment(null)}
          />
        ) : (
          <Payments payments={payments} />
        )}
      </div>
    </section>
  );
}

export default payments;

