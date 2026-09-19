# Landing Builder V1

Protótipo funcional da nova ferramenta.

## Já funciona
- Upload múltiplo de imagens e MP4
- Ordenação dos blocos
- Exclusão
- Seleção de imagens e criação de carrossel
- Botão com texto + URL sobre imagens/carrosséis
- Preview real, responsivo e contínuo
- Imagens sem espaços entre seções
- Vídeos responsivos

## Ainda propositalmente não conectado
O botão **Publicar** está visível, mas a publicação na Vercel será implementada na próxima etapa. Isso evita colocar token/chaves no navegador.

## Rodar localmente
1. Instale Node.js 20+
2. `npm install`
3. `npm run dev`
4. Abra `http://localhost:3000`

## Arquitetura da próxima etapa
A publicação deve acontecer em uma rota server-side, nunca expondo token da Vercel no frontend.
