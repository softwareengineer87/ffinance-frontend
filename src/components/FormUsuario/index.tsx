import { Usuario } from "@/models/Usuario";

interface FormUsuarioProps {
  usuario: Partial<Usuario>;
  alterarUsuario(usuario: Partial<Usuario>): void;
  salvar(): void;
  cancelar(): void;
}

function FormUsuario({
  usuario,
  alterarUsuario,
  salvar,
  cancelar
}: FormUsuarioProps) {
  return (
    <section className="form-usuario">
      <form>
        <div
          style={{ marginBottom: '2rem', padding: '1rem' }}
        >
          <label>Nome</label>
          <input
            style={{ backgroundColor: 'gray', color: '#fff', padding: '1rem' }}
            type="text"
            placeholder="Nome"
            value={usuario.name}
            onChange={(e) => alterarUsuario({ ...usuario, name: e.target.value })}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            style={{ backgroundColor: 'gray', color: '#fff', padding: '1rem' }}
            type="email"
            placeholder="email"
            value={usuario.email}
            onChange={(e) => alterarUsuario({ ...usuario, email: e.target.value })}
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            style={{ backgroundColor: 'gray', color: '#fff', padding: '1rem' }}
            type="password"
            placeholder="senha"
            value={usuario.password}
            onChange={(e) => alterarUsuario({ ...usuario, password: e.target.value })}
          />
        </div>
      </form>
      <button
        style={{ backgroundColor: 'blueviolet', color: '#fff', padding: '1rem' }}
        className="add"
        onClick={salvar}
      >
        Salvar
      </button>
      <button
        onClick={cancelar}
        style={{ backgroundColor: 'gray', color: '#333' }}
      >
        Cancelar
      </button>
    </section>
  );
}

export { FormUsuario }

