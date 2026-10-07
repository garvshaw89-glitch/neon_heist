import React, { useState } from 'react';
import { useGameState, ALL_EQUIPMENT } from './hooks/useGameState';
import { MISSIONS } from './game/missions';
import { Mission, MissionResult } from './types/game';
import { sound } from './game/audio';

// Components
import { OpeningExperience } from './components/intro/OpeningExperience';
import { TopBar, ActiveNavTab } from './components/navigation/TopBar';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { OperationsView } from './components/operations/OperationsView';
import { LoadoutView } from './components/loadout/LoadoutView';
import { BlackMarketView } from './components/market/BlackMarketView';
import { UpgradeTreeView } from './components/upgrades/UpgradeTreeView';
import { ProfileView } from './components/profile/ProfileView';
import { ArchiveView } from './components/archive/ArchiveView';
import { SettingsView } from './components/settings/SettingsView';
import { StealthGame } from './game/StealthGame';
import { MissionResultsModal } from './components/results/MissionResultsModal';
import { CustomCursor } from './components/common/CustomCursor';

export default function App() {
  const {
    player,
    recordMissionResult,
    buyEquipment,
    equipItem,
    upgradeNode,
    resetProgress
  } = useGameState();

  const [inIntro, setInIntro] = useState(true);
  const [currentTab, setCurrentTab] = useState<ActiveNavTab>('DASHBOARD');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Intro transition
  const handleEnterNetwork = (isNewGame: boolean) => {
    if (isNewGame) {
      resetProgress();
      setInIntro(false);
      handleStartMission(MISSIONS[0]);
      return;
    }
    setInIntro(false);
  };

  // Launch a Mission
  const handleStartMission = (mission: Mission) => {
    sound.playConfirm();
    setActiveMission(mission);
  };

  // Quick Heist Deploy
  const handleQuickDeploy = () => {
    // Pick first unfinished or default
    const unfinished = MISSIONS.find(m => !player.completedMissionIds.includes(m.id)) || MISSIONS[0];
    handleStartMission(unfinished);
  };

  // Mission Completed Callback
  const handleMissionComplete = (result: MissionResult) => {
    recordMissionResult(result);
    setMissionResult(result);
    setActiveMission(null);
  };

  // Abort Mission
  const handleAbortMission = () => {
    sound.playSuspicionAlert();
    sound.stopAlarm();
    sound.stopTension();
    setActiveMission(null);
    setCurrentTab('OPERATIONS');
  };

  // Reset Progress
  const handleReset = () => {
    resetProgress();
    setInIntro(true);
  };

  // Render Opening Experience
  if (inIntro) {
    return (
      <>
        <CustomCursor />
        <OpeningExperience
          onEnterNetwork={handleEnterNetwork}
          hasSavedGame={player.stats.missionsCompleted > 0}
        />
      </>
    );
  }

  // Render In-Mission Active Game Canvas
  if (activeMission) {
    return (
      <>
        <CustomCursor />
        <StealthGame
          mission={activeMission}
          onMissionComplete={handleMissionComplete}
          onAbort={handleAbortMission}
        />
      </>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#040609] text-slate-100 flex flex-col overflow-hidden">
      <CustomCursor />
      {/* Universal Top Bar */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        credits={player.credits}
        onQuickHeist={handleQuickDeploy}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto overflow-hidden relative">
        {currentTab === 'DASHBOARD' && (
          <MainDashboard
            player={player}
            onNavigate={setCurrentTab}
            onSelectOperation={() => setCurrentTab('OPERATIONS')}
            onPlayTutorial={() => handleStartMission(MISSIONS[0])}
          />
        )}

        {currentTab === 'OPERATIONS' && (
          <OperationsView
            completedMissionIds={player.completedMissionIds}
            onStartMission={handleStartMission}
          />
        )}

        {currentTab === 'LOADOUT' && (
          <LoadoutView
            player={player}
            onEquipItem={equipItem}
          />
        )}

        {currentTab === 'MARKET' && (
          <BlackMarketView
            player={player}
            onBuyItem={buyEquipment}
          />
        )}

        {currentTab === 'UPGRADES' && (
          <UpgradeTreeView
            player={player}
            onUpgradeNode={upgradeNode}
          />
        )}

        {currentTab === 'PROFILE' && (
          <ProfileView player={player} />
        )}

        {currentTab === 'ARCHIVE' && (
          <ArchiveView />
        )}

        {currentTab === 'SETTINGS' && (
          <SettingsView
            onResetProgress={handleReset}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}
      </main>

      {/* Mission Results Modal */}
      {missionResult && (
        <MissionResultsModal
          result={missionResult}
          onContinue={() => {
            setMissionResult(null);
            setCurrentTab('OPERATIONS');
          }}
        />
      )}
    </div>
  );
}
