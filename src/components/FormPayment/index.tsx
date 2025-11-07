import { Payment } from "@/models/Payment";
import './form-payment.css';

interface FormPaymentProps {
  payment: Partial<Payment>;
  changePayment(payment: Partial<Payment> | null): void;
  savePayment(): void;
  cancell(): void;
}

function FormPayment(
  { payment,
    changePayment,
    savePayment,
    cancell
  }: FormPaymentProps) {


  const defineModes = ['Pagar', 'Receber'];

  return (
    <section className="form-transaction">
      <form className='form-payment'>
        <label htmlFor='value'>Valor</label>
        <input
          onChange={(e) => changePayment({ ...payment, value: e.target.value })}
          value={payment.value}
          type='number'
          id='value'
          placeholder='Valor'
        />
        <label htmlFor='type'>Modo de pagamento</label>
        <select onChange={(e) => changePayment({
          ...payment, payment_mode: e.target.value === 'Pagar' ? 'pay' : 'receive'
        })}>
          <option selected disabled value=''>Escolha o tipo</option>
          {defineModes.map((mode, i) => (
            <option key={i} value={mode}>{mode}</option>
          ))}
        </select>
        <label htmlFor='start-date'>Data inicio</label>
        <input
          onChange={(e) => changePayment({ ...payment, start_date: e.target.value })}
          value={payment.start_date}
          type='date'
          id='start-date'
          placeholder='Data'
        />
        <label htmlFor='end-date'>Data final</label>
        <input
          onChange={(e) => changePayment({ ...payment, end_date: e.target.value })}
          value={payment.end_date}
          type='date'
          id='end-date'
          placeholder='Data'
        />
      </form>
      <div className='buttons'>
        <button
          onClick={savePayment}
          className='btn-payment'>
          Salvar
        </button>
        <button
          onClick={cancell}
          className='btn-cancell'
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}

export { FormPayment }
