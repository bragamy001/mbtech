const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// SIMULAÇÃO DE BANCO DE DADOS (Substituir por Firebase Firestore/Realtime Database real)
const simulatedDB = {}; 

// --- Middlewares ---
app.use(cors({
    origin: 'http://127.0.0.1:5501' 
    // ATENÇÃO: Verifique se a sua porta do Live Server é 5501 e ajuste se necessário.
}));
app.use(express.json());


// --- Rotas da API ---

app.get('/', (req, res) => {
    res.send('MB Tech Backend está rodando!');
});


/**
 * ROTA PARA CRIAÇÃO DE COBRANÇA PIX
 */
app.post('/api/pix/create', async (req, res) => {
    const { courseId, amount } = req.body;

    if (!courseId || !amount) {
        return res.status(400).json({ 
            error: 'Dados incompletos para a transação.' 
        });
    }

    try {
        // ------------------------------------------------------------------
        // 1. CHAME A API DO PSP AQUI (Integração Real)
        // ------------------------------------------------------------------
        
        const pspResponse = await simulatePspCall(amount); // Simulação da chamada
        
        const transactionId = pspResponse.pspTransactionId;
        const pixCode = pspResponse.pixCode;
        const qrCodeUrl = pspResponse.qrCodeUrl;

        // ------------------------------------------------------------------
        // 2. SALVAR A TRANSAÇÃO NO BANCO DE DADOS (Firebase)
        // ------------------------------------------------------------------
        
        const transactionRecord = {
            courseId: courseId,
            amount: amount,
            status: 'PENDENTE',
            pixCode: pixCode,
            qrCodeUrl: qrCodeUrl,
            createdAt: new Date().toISOString()
        };

        simulatedDB[transactionId] = transactionRecord;
        console.log(`Transação ${transactionId} registrada como Pendente no DB. Valor: R$ ${amount}`);


        // 3. Retorna a resposta para o frontend
        res.status(200).json({
            success: true,
            transactionId: transactionId,
            pixCode: pixCode,
            qrCodeUrl: qrCodeUrl, 
            message: 'Cobrança Pix gerada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao processar a criação do Pix:', error);
        res.status(500).json({ 
            error: 'Falha interna ao comunicar com o gateway de pagamento.' 
        });
    }
});


// SIMULAÇÃO DA CHAMADA A UMA API DE PSP
async function simulatePspCall(amount) {
    // Código de simulação de um Pix Copia e Cola (Ainda inválido para o banco)
    const simulatedPixCode = `00020101021226580014BR.GOV.BCB.PIX013669199d79-66c8-4ed0-9b4e-868d40523f2f5204000053039865405${amount.toFixed(2).replace('.', '')}5802BR5925NOME DA EMPRESA MB TECH6009SAO PAULO62070503***6304CAFE`;
    
    return {
        pspTransactionId: `TX${Date.now()}`,
        // URL de uma imagem de QR Code de TESTE (Troque por uma URL real do PSP)
        qrCodeUrl: 'https://i.imgur.com/g82Wlq0.png', 
        pixCode: simulatedPixCode
    };
}


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});