'use client';

import { Usuario } from "@/models/Usuario";
import { useState } from "react";
import { ListaUsuarios } from "../ListaUsuarios";
import { FormUsuario } from "../FormUsuario";

function CadastroUsuario() {

  const arrUsuarios: Usuario[] = [
    { id: randomId(), name: 'Aninha', email: 'aninha@gmail.com', password: '12345' },
    { id: randomId(), name: 'Flavia', email: 'flavia@gmail.com', password: '12345' },
    { id: randomId(), name: 'Joana', email: 'joana@gmail.com', password: '12345' },
  ]


  const [usuarios, setUsuarios] = useState<Usuario[]>(arrUsuarios);
  const [usuarioAtual, setUsuarioAtual] = useState<Partial<Usuario> | null>(null);

  function randomId() {
    return Math.random().toString(30).substring(2, 10);
  }

  function removerUsuario(usuario: Usuario) {
    const novosUsuarios = usuarios.filter((u) => u.id !== usuario.id);
    setUsuarios(novosUsuarios);
  }

  function selecionarUsuario(usuario: Usuario) {
    setUsuarioAtual(usuario);
  }

  function salvarUsuario() {
    const buscaUsuario = usuarios.find((u) => u.id === usuarioAtual?.id);
    if (buscaUsuario) {
      const novosUsuarios = usuarios.map((u) => {
        return u.id === usuarioAtual?.id ? usuarioAtual : u;
      });
      setUsuarios(novosUsuarios as Usuario[]);
    } else {
      setUsuarios([...usuarios, usuarioAtual as Usuario]);
    }
    setUsuarioAtual(null);
  }

  return (
    <section className="cadastro-usuario">
      <p>Cadastro usuario</p>
      {usuarioAtual ? (
        <FormUsuario
          usuario={usuarioAtual}
          alterarUsuario={setUsuarioAtual}
          salvar={salvarUsuario}
          cancelar={() => setUsuarioAtual(null)}
        />
      ) : (
        <>
          <button
            onClick={() => setUsuarioAtual({ id: randomId() } as Usuario)}
            style={{
              backgroundColor: 'blue',
              color: '#fff',
              padding: '1rem',
              marginTop: '2rem',
              marginBottom: '2rem',
              cursor: 'pointer'
            }}
          >
            Novo usuario
          </button>
          <ListaUsuarios
            usuarios={usuarios}
            removerUsuario={removerUsuario}
            selecionarUsuario={selecionarUsuario}
          />
        </>
      )}
    </section>
  );
}

export { CadastroUsuario }

