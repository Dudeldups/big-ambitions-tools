import { Button } from "./ui/button";

const name = process.env.NEXT_PUBLIC_LEGAL_NAME;
const line1 = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_LINE1;
const line2 = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_LINE2;
const city = process.env.NEXT_PUBLIC_LEGAL_ADDRESS_CITY;
const email = process.env.NEXT_PUBLIC_LEGAL_EMAIL;

const Address = () => {
  return (
    <address className="space-y-1 not-italic">
      {name && <p>{name}</p>}
      {line1 && <p>{line1}</p>}
      {line2 && <p>{line2}</p>}
      {city && <p>{city}</p>}

      {email && (
        <p className="pt-2">
          E-Mail:{" "}
          <Button asChild>
            <a href={`mailto:${email}`} className="font-semibold">
              {email}
            </a>
          </Button>
        </p>
      )}
    </address>
  );
};

export default Address;
