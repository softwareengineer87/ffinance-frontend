import { Usuario } from "@/models/Usuario";
import './lista.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface ListaUsuariosProps {
  usuarios: Usuario[];
  removerUsuario(usuario: Usuario): void;
  selecionarUsuario(usuario: Usuario): void;
}

function ListaUsuarios({
  usuarios,
  removerUsuario,
  selecionarUsuario
}: ListaUsuariosProps) {
  return (
    <section className="lista-usuarios">
      <ul>
        {usuarios.length === 0 ? (
          <p>Nao usuarios cadastrados</p>
        ) : usuarios.map((usuario: Usuario) => (
          <li key={usuario.id}>
            <div className="box-infos">
              <div className="infos">
                <h2>{usuario.name}</h2>
                <span>{usuario.email}</span>
              </div>
              <div className="actions">
                <button
                  className="edit"
                  onClick={() => selecionarUsuario(usuario)}
                >
                  <IconEdit />
                </button>
                <button
                  onClick={() => removerUsuario(usuario)}
                  className="del"
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ListaUsuarios }

