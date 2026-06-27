# 🍅 POMODORO++

Um gerenciador de tarefas moderno e intuitivo baseado na Técnica Pomodoro, projetado para ajudá-lo a organizar sua rotina diária, aumentar produtividade e manter o foco em atividades importantes.

**Live Demo:** [pomodoro-mocha-one.vercel.app](https://pomodoro-mocha-one.vercel.app/)

---

## ✨ Características Principais

- **Gerenciamento de Tarefas** — Crie, edite e delete tarefas com título, descrição e duração customizável
- **Drag & Drop** — Reordene suas tarefas de forma intuitiva entre o painel de planejamento e fila
- **Timer Inteligente** — Execute tarefas com timer integrado com controles de play, pause, reset e skip
- **Notificações** — Receba alertas sonoros ao concluir cada tarefa
- **Interface Responsiva** — Funciona perfeitamente em desktop e dispositivos móveis
- **Temas Personalizáveis** — Escolha entre diferentes temas de cor para sua experiência

---

## 🎯 Como Funciona

### Painel de Planejamento (Esquerda)
Sua lista de tarefas planejadas. Aqui você pode:
- Adicionar novas tarefas clicando em "Add task"
- Editar título, descrição e duração de cada tarefa
- Deletar tarefas que não são mais necessárias
- Arrastar tarefas para a fila de execução

### Estágio de Foco (Centro)
O coração da aplicação com:
- Timer visual mostrando tempo restante
- Título e descrição da tarefa atual
- Controles de play/pause, reset e conclusão
- Visualização da próxima tarefa na fila

### Fila & Concluídas (Direita)
- **Fila**: Tarefas prontas para execução em ordem
- **Concluídas**: Histórico de tarefas completadas neste ciclo

---

## 🚀 Começando

### Pré-requisitos
- Node.js 16+
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/RockyPHER/pomodoro--.git
cd pomodoro--

# Instale as dependências
npm install
# ou
pnpm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

### Build para Produção

```bash
npm run build
```

---

## ⌨️ Atalhos do Teclado

| Tecla | Ação |
|-------|------|
| <kbd>Space</kbd> | Play/Pause timer |
| <kbd>Enter</kbd> | Conclui tarefa atual |
| <kbd>N</kbd> | Cria nova tarefa |
| <kbd>T</kbd> | Alterna painel de planejamento |
| <kbd>Q</kbd> | Alterna fila de tarefas |

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Animações**: Motion (Framer Motion)
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React

---

## 📸 Capturas de Tela

| Planejamento | Execução | Controles |
|:---:|:---:|:---:|
| ![image](https://github.com/RockyPHER/pomodoro--/assets/132969260/47143b44-7574-471a-b1c3-ea88c6e714c9) | ![image](https://github.com/RockyPHER/pomodoro--/assets/132969260/2f379306-322b-4687-b853-700191c19ba6) | ![image](https://github.com/RockyPHER/pomodoro--/assets/132969260/96061323-3e1b-485f-8904-b2a6efbc9067) |

| Durante Execução |
|:---:|
| ![image](https://github.com/RockyPHER/pomodoro--/assets/132969260/df3d088b-8306-425b-a5ae-11467a442a20) |

---

## 💡 Dicas de Uso

1. **Planeje primeiro** — Adicione todas as tarefas do dia no painel de planejamento antes de começar
2. **Customize durações** — Ajuste o tempo de cada tarefa conforme sua produtividade típica
3. **Use descrições** — Adicione contexto a cada tarefa para não perder o foco
4. **Revise regularmente** — Verifique o histórico de concluídas para medir seu progresso

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs via issues
- Sugerir novas features
- Enviar pull requests com melhorias

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Feito com ❤️ para aumentar sua produtividade**
