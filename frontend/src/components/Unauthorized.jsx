export const Unauthorized = () => (
    <div style={{
        textAlign: 'center',
        marginTop: '100px',
        fontFamily: 'Quicksand',
        color: '#8e3f65'
    }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta área administrativa.</p>
        <a href="/" style={{ color: '#72a5ae', fontWeight: 'bold' }}>Voltar para o Início</a>
    </div>
);