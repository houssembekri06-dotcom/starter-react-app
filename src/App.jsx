import { HashRouter, Routes, Route, Navigate } from '@/lib/router-compat';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import PhoneFrame from './components/PhoneFrame';
import TabBar from './components/TabBar';

import Onboarding from './screens/Onboarding';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Home from './screens/Home';
import Lesson from './screens/Lesson';
import Quiz from './screens/Quiz';
import Profile from './screens/Profile';
import Wallet from './screens/Wallet';
import League from './screens/League';
import AssetDetail from './screens/AssetDetail';

function Gate({ children }) {
  const { onboarded } = useProgress();
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function TabScreen({ children }) {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <Gate>
            <TabScreen><Home /></TabScreen>
          </Gate>
        }
      />
      <Route
        path="/wallet"
        element={
          <Gate>
            <TabScreen><Wallet /></TabScreen>
          </Gate>
        }
      />
      <Route
        path="/league"
        element={
          <Gate>
            <TabScreen><League /></TabScreen>
          </Gate>
        }
      />
      <Route
        path="/profile"
        element={
          <Gate>
            <TabScreen><Profile /></TabScreen>
          </Gate>
        }
      />
      <Route
        path="/lesson/:lessonId"
        element={<Gate><Lesson /></Gate>}
      />
      <Route
        path="/lesson/:lessonId/quiz"
        element={<Gate><Quiz /></Gate>}
      />
      <Route
        path="/asset/:assetId"
        element={<Gate><AssetDetail /></Gate>}
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <PhoneFrame noPadding>
          <AppRoutes />
        </PhoneFrame>
      </HashRouter>
    </ProgressProvider>
  );
}
