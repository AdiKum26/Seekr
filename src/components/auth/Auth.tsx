import { motion } from 'motion/react';
import { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-[var(--university-primary)] mb-2"
          >
            Seekr
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            AI-Powered Student Success Platform
          </motion.p>
        </div>

        {/* Auth Form */}
        <motion.div
          key={isSignUp ? 'signup' : 'signin'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isSignUp ? (
            <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
          ) : (
            <SignIn onSwitchToSignUp={() => setIsSignUp(true)} />
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </div>
    </div>
  );
}
