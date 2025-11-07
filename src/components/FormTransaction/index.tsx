import { Transaction } from "@/models/Transaction";
import './form-transaction.css';

interface FormTransactionProps {
  transaction: Partial<Transaction>;
  changeTransaction(transaction: Partial<Transaction> | null): void;
  saveTransaction(): void;
  cancell(): void;
}

function FormTransaction(
  { transaction,
    changeTransaction,
    saveTransaction,
    cancell
  }: FormTransactionProps) {


  const defineTypes = ['receita', 'despesa'];

  return (
    <section className="form-transaction">
      <form className='form-transaction'>
        <label htmlFor='value'>Valor</label>
        <input
          onChange={(e) => changeTransaction({ ...transaction, value: e.target.value })}
          value={transaction?.value}
          type='number'
          id='value'
          placeholder='Valor'
        />
        <label htmlFor='description'>Descrição</label>
        <textarea
          onChange={(e) => changeTransaction({ ...transaction, description: e.target.value })}
          placeholder='Descrição da transação'
          id='description'
          value={transaction?.description}
        ></textarea>
        <label htmlFor='type'>Tipo</label>
        <select onChange={(e) => changeTransaction({
          ...transaction, type: e.target.value === 'receita' ? 'recipe' : 'expense'
        })}>
          <option selected disabled>Escolha o tipo</option>
          {defineTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>
        <label htmlFor='value'>Criar categoria</label>
        <input
          onChange={(e) => changeTransaction({ ...transaction, category: e.target.value })}
          value={transaction?.category}
          type='text'
          id='category'
          placeholder='Categoria(opicional)'
        />
        <label htmlFor='date'>Data</label>
        <input
          onChange={(e) => changeTransaction({ ...transaction, date: e.target.value })}
          value={transaction?.date}
          type='date'
          id='date'
          placeholder='Data'
        />
      </form>
      <div className='buttons'>
        <button
          onClick={saveTransaction}
          className='btn-transaction'>
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

export { FormTransaction }
