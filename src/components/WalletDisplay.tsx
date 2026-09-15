interface Props {
  balance: number;
  locked?: boolean;
}

export function WalletDisplay({ balance, locked = false }: Props) {
  if (locked) return null;
  return (
    <div className="wallet-display" aria-label={`Portefeuille : ${balance} trèfles`}>
      <span className="wallet-display__symbol">♣</span>
      <span className="wallet-display__amount">{balance}</span>
    </div>
  );
}