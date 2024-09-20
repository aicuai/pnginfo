// /components/Layout.js
export default function Layout({ children }) {
    return (
      <div className="container">
        <main>{children}</main>
        <style jsx global>{`
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }