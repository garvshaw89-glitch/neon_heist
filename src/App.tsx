import React, { useState } from 'react';
import { useGameState, ALL_EQUIPMENT } from './hooks/useGameState';
import { MISSIONS } from './game/missions';
import { Mission, MissionResult, PlayerState } from './types/game';
import { sound } from './game/audio';

// Components
import { BootSequence } from './components/intro/BootSequence';
import { OpeningExperience } from './components/intro/OpeningExperience';
import { TopBar, ActiveNavTab } from './components/navigation/TopBar';
import { GameFooter } from './components/navigation/GameFooter';
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
import { AchievementsModal } from './components/achievements/AchievementsModal';
import { SaveSlotsModal } from './components/save/SaveSlotsModal';
import { CreditsModal } from './components/credits/CreditsModal';
import { CustomCursor } from './components/common/CustomCursor';
import { ToastContainer, toast } from './components/common/ToastSystem';
import { GameErrorBoundary } from './components/common/GameErrorBoundary';
import { BackgroundMotionEngine } from './components/effects/BackgroundMotionEngine';
import { MissionLoadingScreen } from './components/loading/MissionLoadingScreen';
import { validateMission } from './game/missionLauncher';

export default function App() {
  const {
    player,
    setPlayer,
    recordMissionResult,
    buyEquipment,
    equipItem,
    upgradeNode,
    resetProgress
  } = useGameState();

  const [inBoot, setInBoot] = useState(true);
  const [inIntro, setInIntro] = useState(true);
  const [currentTab, setCurrentTab] = useState<ActiveNavTab>('DASHBOARD');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [loadingMission, setLoadingMission] = useState<Mission | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSaves, setShowSaves] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Launch a Mission with Full Validation & Loading Pipeline
  const handleStartMission = (mission: Mission) => {
    if (isLaunching) {
      console.warn(`[App.tsx::handleStartMission] Ignored duplicate launch request for ${mission?.id} (isLaunching = true)`);
      return;
    }
    setIsLaunching(true);
    setLoadingError(null);

    // Safeguard: Ensure intro and boot screens are dismissed so gameplay can mount
    setInBoot(false);
    setInIntro(false);

    console.log(`[App.tsx::handleStartMission] Initiating mission dispatch:`, {
      missionId: mission.id,
      operationCode: mission.operationCode,
      title: mission.title,
      actNumber: mission.actNumber,
      levelNumber: mission.levelNumber,
      difficulty: mission.difficulty,
      playerStart: mission.playerStart,
      mapDimensions: `${mission.mapWidth}x${mission.mapHeight}`,
      guardsCount: mission.guards?.length,
      camerasCount: mission.cameras?.length,
      lasersCount: mission.lasers?.length,
      terminalsCount: mission.terminals?.length,
      wallsCount: mission.walls?.length,
      lightsCount: mission.lights?.length,
      envObjectsCount: mission.envObjects?.length,
      vaultPosition: mission.vault ? { x: mission.vault.x, y: mission.vault.y, target: mission.targetName } : null,
      extraction: mission.extraction,
      timestamp: new Date().toISOString()
    });

    const validation = validateMission(mission);
    if (!validation.isValid) {
      console.error(`[App.tsx::handleStartMission] Mission validation failed for ${mission.id}:`, validation.error);
      sound.playSuspicionAlert();
      setLoadingMission(mission);
      setLoadingError(validation.error || 'Failed to validate operation parameters.');
      setIsLaunching(false);
      return;
    }

    console.log(`[App.tsx::handleStartMission] Validation passed successfully for [${mission.operationCode}]. Entering LOADING pipeline.`);
    sound.playConfirm();
    setLoadingMission(validation.mission!);
  };

  const handleLoadingComplete = () => {
    if (loadingMission) {
      console.log(`[App.tsx::handleLoadingComplete] Loading pipeline complete. Transitioning loadingMission -> activeMission:`, {
        missionId: loadingMission.id,
        operationCode: loadingMission.operationCode,
        title: loadingMission.title,
        levelNumber: loadingMission.levelNumber,
        playerSpawn: loadingMission.playerStart,
        mapBounds: `${loadingMission.mapWidth}x${loadingMission.mapHeight}`,
        targetName: loadingMission.targetName,
        extraction: loadingMission.extraction,
        guardsCount: loadingMission.guards?.length,
        camerasCount: loadingMission.cameras?.length,
        lasersCount: loadingMission.lasers?.length,
        terminalsCount: loadingMission.terminals?.length,
        wallsCount: loadingMission.walls?.length,
        timestamp: new Date().toISOString()
      });
      // Ensure intro/boot flags cannot block gameplay mounting
      setInIntro(false);
      setInBoot(false);
      setActiveMission(loadingMission);
      setLoadingMission(null);
      setIsLaunching(false);
    } else {
      console.warn(`[App.tsx::handleLoadingComplete] Warning: Invoked but loadingMission is null. ActiveMission state:`, activeMission ? activeMission.id : 'none');
    }
  };

  // Intro transition
  const handleEnterNetwork = (isNewGame: boolean) => {
    if (isNewGame) {
      resetProgress();
      setInIntro(false);
      handleStartMission(MISSIONS[0]);
      return;
    }
    // "CONTINUE OPERATION" - find next incomplete mission or Level 1
    const nextMission = MISSIONS.find(m => !player.completedMissionIds.includes(m.id)) || MISSIONS[0];
    setInIntro(false);
    handleStartMission(nextMission);
  };

  // Quick Heist Deploy
  const handleQuickDeploy = () => {
    const unfinished = MISSIONS.find(m => !player.completedMissionIds.includes(m.id)) || MISSIONS[0];
    handleStartMission(unfinished);
  };

  // Mission Completed Callback
  const handleMissionComplete = (result: MissionResult) => {
    recordMissionResult(result);
    setMissionResult(result);
    setActiveMission(null);
    setLoadingMission(null);
    setIsLaunching(false);
    toast.success('CONTRACT FULFILLED', `Acquired ₡${result.totalPayout.toLocaleString()} from ${result.facilityName}`);
  };

  // Abort Mission
  const handleAbortMission = () => {
    sound.playSuspicionAlert();
    sound.stopAlarm();
    sound.stopTension();
    setActiveMission(null);
    setLoadingMission(null);
    setIsLaunching(false);
    setCurrentTab('OPERATIONS');
  };

  // Reset Progress
  const handleReset = () => {
    resetProgress();
    setInIntro(true);
  };

  // Load imported or slotted player state
  const handleLoadPlayer = (loaded: PlayerState) => {
    setPlayer(loaded);
  };

  return (
    <GameErrorBoundary>
      <CustomCursor />
      <ToastContainer />

      {/* 01 BOOT SEQUENCE */}
      {inBoot && (
        <BootSequence
          onComplete={() => setInBoot(false)}
        />
      )}

      {/* 02 TITLE SCREEN & MAIN MENU */}
      {!inBoot && inIntro && (
        <OpeningExperience
          onEnterNetwork={handleEnterNetwork}
          hasSavedGame={player.stats.missionsCompleted > 0}
          onNavigateTo={(tab) => {
            setInIntro(false);
            setCurrentTab(tab);
          }}
          onOpenCredits={() => setShowCredits(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenSaves={() => setShowSaves(true)}
        />
      )}

      {/* 03 ACTIVE INFILTRATION GAMEPLAY */}
      {!inBoot && !inIntro && activeMission && (
        <StealthGame
          mission={activeMission}
          onMissionComplete={handleMissionComplete}
          onAbort={handleAbortMission}
        />
      )}

      {/* 03.5 MISSION LOADING / BRIEFING PIPELINE */}
      {loadingMission && (
        <MissionLoadingScreen
          mission={loadingMission}
          onReady={handleLoadingComplete}
          onAbort={() => {
            setLoadingMission(null);
            setLoadingError(null);
            setIsLaunching(false);
            setCurrentTab('OPERATIONS');
          }}
          error={loadingError}
          onRetry={() => handleStartMission(loadingMission)}
        />
      )}

      {/* 04 TACTICAL COMMAND ENVIRONMENT (NON-GAMEPLAY) */}
      {!inBoot && !inIntro && !activeMission && (
        <div className="relative w-screen h-screen text-slate-100 flex flex-col overflow-hidden">
          {/* Living 3D Atmospheric Background Engine (Behind all tactical content) */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <BackgroundMotionEngine />
          </div>

          {/* Tactical Backdrop Tint for Visual Contrast & Legibility */}
          <div className="fixed inset-0 pointer-events-none z-[1] bg-[#040609]/70 backdrop-blur-[1.5px]" />

          {/* Tactical Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
            {/* Universal Header System */}
            <TopBar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              credits={player.credits}
              onQuickHeist={handleQuickDeploy}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />

          {/* Main Tactical View Workspace (Responsive Scrollable Container) */}
          <main className="flex-1 w-full max-w-[1560px] mx-auto overflow-y-auto relative min-h-0">
            {currentTab === 'DASHBOARD' && (
              <MainDashboard
                player={player}
                onNavigate={setCurrentTab}
                onSelectOperation={() => setCurrentTab('OPERATIONS')}
                onPlayTutorial={() => handleStartMission(MISSIONS[0])}
                onStartMission={handleStartMission}
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

          {/* Terminal System Status Footer (Strictly non-gameplay) */}
          <GameFooter
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenSaves={() => setShowSaves(true)}
            onOpenCredits={() => setShowCredits(true)}
            onOpenKeybinds={() => setCurrentTab('SETTINGS')}
          />
        </div>
      </div>
    )}

      {/* MODALS */}
      {missionResult && (
        <MissionResultsModal
          result={missionResult}
          onContinue={() => {
            setMissionResult(null);
            setCurrentTab('OPERATIONS');
          }}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          unlockedIds={player.achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showSaves && (
        <SaveSlotsModal
          currentPlayer={player}
          onLoadPlayer={handleLoadPlayer}
          onResetProgress={handleReset}
          onClose={() => setShowSaves(false)}
        />
      )}

      {showCredits && (
        <CreditsModal
          onClose={() => setShowCredits(false)}
        />
      )}
    </GameErrorBoundary>
  );
}
