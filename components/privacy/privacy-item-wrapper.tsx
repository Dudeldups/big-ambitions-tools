type PrivacyItemWrapperProps = {
  children: React.ReactNode;
  title: string | React.ReactNode;
};

const PrivacyItemWrapper = ({ children, title }: PrivacyItemWrapperProps) => {
  return (
    <li>
      <div className="space-y-4 text-left">
        <h2 className="text-h3 mb-6 max-md:text-center">{title}</h2>

        {children}
      </div>
    </li>
  );
};

export default PrivacyItemWrapper;
