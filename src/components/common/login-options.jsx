import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Loader } from "@/components/ui/Loader"; 
import Logo from './icone/googleIcon.png';

import { login_by_email, getNumberAndName, sendValidationCode } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const LoginOptions = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;
        const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        }).then(res => res.json());
        const email = profile.email;

        const result = await login_by_email(email);
        const userInfo = await getNumberAndName(email);
        const userDetails = {
          name: userInfo.name,
          phoneNumber: userInfo.mobile_number,
          email: userInfo.mail,
          token: result.token
        };

        await sendValidationCode({
          mail: userDetails.email,
          phone_number: userDetails.phoneNumber,
          name: userDetails.name
        });

        navigate('/code', {
          state: {
            name: userDetails.name,
            mail: userDetails.email,
            numero: userDetails.phoneNumber,
            token: userDetails.token
          }
        });
      } catch (err) {
        console.error('Erreur login sans mot de passe :', err);
        setDialogOpen(true);
      } finally {
        setLoading(false); 
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la connexion avec Google :', error);
      setLoading(false); 
    },
  });

  const handleGoogleLogin = () => {
    setLoading(true); 
    login();
  };

  return (
    <>
      {/* Affichage du loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <Loader />
        </div>
      )}

      {/* Dialog d’erreur */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Compte introuvable</DialogTitle>
            <DialogDescription className="text-xs">
              Nous n'avons pas trouvé de compte associé à cet e-mail. Veuillez vérifier votre adresse e-mail ou créer un compte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button className="text-xs bg-red-800">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bouton Google */}
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="text-sm w-full rounded-full border-2 border-gray-700 flex items-center justify-center"
          onClick={handleGoogleLogin} // 👈 Nouveau handler
        >
          <img src={Logo} alt="Google Icon" className="mr-2 w-6 h-6" />
          <span>Continuer avec Google</span>
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-sm text-muted-foreground">
          Ou
        </span>
      </div>
    </>
  );
};

export default () => (
  <GoogleOAuthProvider clientId="1032870874107-dnof9g1hpr6nfucib3a2lhgreqnr8dod.apps.googleusercontent.com">
    <LoginOptions />
  </GoogleOAuthProvider>
);
