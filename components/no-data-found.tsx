type NoDataFoundProps = {
  text: string;
};

const NoDataFound = ({ text }: NoDataFoundProps) => {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-10">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default NoDataFound;
