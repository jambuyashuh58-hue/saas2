
export const metadata = {
  title: 'HomeFit Solutions — Turnkey Fitouts',
  description: 'Move-in ready fitouts for homes, restaurants, laundromats',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0}}>{children}</body>
    </html>
  );
}
