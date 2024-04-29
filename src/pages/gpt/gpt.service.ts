import { requestGPT } from "./components/requestGPT";
import { requestSD } from "./components/requestSD";

type props = {
  name: "Excel" | "Word" | "PowerPoint";
};
const htmlGenerator = ({ name }: props) => {
  return `
    Responda em pt-br, create simple page html to response, no comments, no explain.
    Eu tenho um curso de informática básica onde eu ensino ${name} em português.
    Crie uma dica.
    exemple:

    \`\`\`html
    <!DOCTYPE html>
<html>
<head>        
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;                
        }    
        .card {
            width: 320px;
            border: 1px solid #ccc;
            border-radius: 10px;           
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);                  
            background-size: cover;
            background-position: center;
            color: white;
        }
        .view {
            width: 320px;
            background-color: rgba(0, 0, 0, 0.5);               
        }     
        h1 {              
            text-align: center;
            padding: 5px; 
        }   
        h2 {            
            margin-bottom: 10px;
            text-align: center;  
            padding: 5px;         
        }   
        ol {            
            margin-bottom: 5px;
            margin-top: 5px;
        }
        li {
            padding: 3px;
            margin-bottom: 5px;
            margin-left: 10px;
            margin-top: 5px;
            font-size: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
            text-height: 1.5;                      
        }

    </style>
</head>
<body>
    <div class="card">
    <div class="view">
        <h1>${name}</h1>          
        <h2>{dica}</h2>
        <ol>
            <li>{passo a passo}</li>
        </ol>
    </div>
    </div>
</body>
</html>
\`\`\`
`;
};
export async function gptService() {
  async function create(body: object, user: object | null) {
    const content = htmlGenerator({ name: "Excel" });
    const createMensagem = await requestGPT({ content });
    const image = await requestSD({
      content:
        "rodeado por formas e padrões coloridos. Incorpore os ícones das três aplicações Microsoft Office que você ensina (Excel, Word, PowerPoint). Faça a imagem viva e divertida, transmitindo a ideia de que a formatação condicional",
    });

    const result = createMensagem?.replace(
      ".card {",
      `.card {
        background-image: url(data:image/jpeg;base64,${image});
        `
    );
    return result;
  }

  return { create };
}
