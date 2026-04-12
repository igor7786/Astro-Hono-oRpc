import { Button } from '@rcomp/ui/button';

type Props = {
  icons: {
    google: string;
    twitter: string;
    facebook: string;
    github: string;
  };
};

const ButtonSocialDemo = ({ icons }: Props) => {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      <Button variant="outline">
        <img src={icons.google} alt="Google" className="size-5" />
        <span className="flex flex-1 justify-center">Continue with Google</span>
      </Button>

      <Button variant="outline">
        <img src={icons.twitter} alt="X" className="size-5" />
        <span className="flex flex-1 justify-center">Continue with X</span>
      </Button>

      <Button variant="outline">
        <img src={icons.facebook} alt="Facebook" className="size-5" />
        <span className="flex flex-1 justify-center">Continue with Facebook</span>
      </Button>

      <Button variant="outline">
        <img src={icons.github} alt="GitHub" className="size-5" />
        <span className="flex flex-1 justify-center">Continue with GitHub</span>
      </Button>
    </div>
  );
};

export default ButtonSocialDemo;
