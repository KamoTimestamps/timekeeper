/**
 * Settings Modal
 * Extracted from timekeeper.ts to reduce coupling and improve maintainability.
 */

import * as GoogleDrive from './google-drive';
import * as TimestampModel from './timestamp-model';
import { createIcon, setIcon, setIconLabel, TablerIconName } from './icons';
import { addTooltip } from './tooltip';
import {
  createModalCloseHandler,
  createEscapeKeyHandler,
  registerModalEscapeHandler,
  createClickOutsideHandler,
  registerModalClickOutsideHandler,
} from './modals';
import { showToast } from './toast';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration for the settings modal button actions.
 * Provided by timekeeper.ts where button onclick handlers live.
 */
export interface SettingsModalConfig {
  saveBtnOnClick: (...args: unknown[]) => unknown;
  loadBtnOnClick: (...args: unknown[]) => unknown;
  exportBtnOnClick: (...args: unknown[]) => unknown;
  importBtnOnClick: (...args: unknown[]) => unknown;
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Close all subdialogs (save, load, delete-all) before closing the settings modal.
 */
function closeAllSubdialogs(): void {
  const saveModal = document.getElementById('ytls-save-modal');
  const loadModal = document.getElementById('ytls-load-modal');
  const deleteModal = document.getElementById('ytls-delete-all-modal');
  if (saveModal && document.body.contains(saveModal)) {
    document.body.removeChild(saveModal);
  }
  if (loadModal && document.body.contains(loadModal)) {
    document.body.removeChild(loadModal);
  }
  if (deleteModal && document.body.contains(deleteModal)) {
    document.body.removeChild(deleteModal);
  }
}

/**
 * Create a button with common styles, tooltip, and icon for the settings modal.
 */
function createButton(
  label: string,
  title: string,
  onClick: (...args: unknown[]) => unknown,
  icon?: TablerIconName,
): HTMLButtonElement {
  const button = document.createElement('button');
  if (icon) {
    setIconLabel(button, icon, label);
  } else {
    button.textContent = label;
  }
  addTooltip(button, title);
  button.classList.add('ytls-settings-modal-button');
  button.onclick = onClick;
  return button;
}

// ============================================================================
// EXTERNAL STATE REFERENCES
// These module-level variables are set by timekeeper.ts via initSettingsModal.
// ============================================================================

let settingsModalInstance: HTMLDivElement | null = null;
let settingsCogButtonElement: HTMLButtonElement | null = null;

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Initialize the settings modal with external state references from timekeeper.ts.
 * Must be called once when the pane is initialized.
 */
export function initSettingsModal(
  modalRef: HTMLDivElement | null,
  cogButton: HTMLButtonElement | null,
): void {
  settingsModalInstance = modalRef;
  settingsCogButtonElement = cogButton;
}

/**
 * Toggle the settings modal open/closed.
 * Returns the modal element for tracking by the caller.
 */
export function toggleSettingsModal(
  config: SettingsModalConfig,
  initialTab: 'general' | 'google' | 'backend' | 'drive' = 'general',
): HTMLDivElement {
   // Check if modal is already open — if so, close it
  const existingModal = document.getElementById('ytls-settings-modal');
  if (
    existingModal &&
    existingModal.parentNode === document.body
   ) {
    closeAllSubdialogs();
    existingModal.classList.remove('ytls-fade-in');
    existingModal.classList.add('ytls-fade-out');
    setTimeout(() => {
      if (document.body.contains(existingModal)) {
        document.body.removeChild(existingModal);
       }
      settingsModalInstance = null;
      document.removeEventListener(
         'click',
        handleClickOutsideSettingsModal,
        true,
       );
      document.removeEventListener('keydown', handleSettingsModalEscape);
     }, 300);
    return existingModal as HTMLDivElement;
   }

   // Modal doesn't exist or isn't visible — create and show it
  const modal = document.createElement('div');
  modal.id = 'ytls-settings-modal';
  modal.classList.remove('ytls-fade-out');
  modal.classList.add('ytls-fade-in');

   // Create header container with tabs and close button
  const header = document.createElement('div');
  header.className = 'ytls-modal-header';

  const nav = document.createElement('div');
  nav.id = 'ytls-settings-nav';

  const closeButton = document.createElement('button');
  closeButton.className = 'ytls-modal-close-button';
  setIcon(closeButton, 'x', 14);
  closeButton.onclick = () => {
    closeAllSubdialogs();
    modal.classList.remove('ytls-fade-in');
    modal.classList.add('ytls-fade-out');
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
       }
      settingsModalInstance = null;
      document.removeEventListener(
         'click',
        handleClickOutsideSettingsModal,
        true,
       );
      document.removeEventListener('keydown', handleSettingsModalEscape);
     }, 300);
   };

  const settingsContent = document.createElement('div');
  settingsContent.id = 'ytls-settings-content';

  const sectionHeading = document.createElement('h3');
  sectionHeading.className = 'ytls-section-heading';
  sectionHeading.textContent = 'General';
  sectionHeading.style.display = 'none';

  const generalSection = document.createElement('div');
  const googleSection = document.createElement('div');
  googleSection.className = 'ytls-button-grid';
  const backendSection = document.createElement('div');
  backendSection.className = 'ytls-button-grid';

  function showSection(section: 'general' | 'google' | 'backend') {
    generalSection.style.display =
      section === 'general' ? 'block' : 'none';
    googleSection.style.display = section === 'google' ? 'block' : 'none';
    backendSection.style.display =
      section === 'backend' ? 'block' : 'none';
    generalTab.classList.toggle('active', section === 'general');
    googleTab.classList.toggle('active', section === 'google');
    backendTab.classList.toggle('active', section === 'backend');
    sectionHeading.textContent =
      section === 'general'
         ? 'General'
         : section === 'google'
           ? 'Google'
           : 'Timekeeper Backend';
   }

  const generalTab = document.createElement('button');
  generalTab.appendChild(createIcon('adjustments-horizontal', 16));
  const generalTabText = document.createElement('span');
  generalTabText.className = 'ytls-tab-text';
  generalTabText.textContent = ' General';
  generalTab.appendChild(generalTabText);
  addTooltip(generalTab, 'General settings');
  generalTab.classList.add('ytls-settings-modal-button');
  generalTab.onclick = () => showSection('general');

  const googleTab = document.createElement('button');
  googleTab.appendChild(createIcon('cloud', 16));
  const googleTabText = document.createElement('span');
  googleTabText.className = 'ytls-tab-text';
  googleTabText.textContent = ' Google';
  googleTab.appendChild(googleTabText);
  addTooltip(googleTab, 'Google Drive backup settings');
  googleTab.classList.add('ytls-settings-modal-button');
  googleTab.onclick = async () => {
    if (GoogleDrive.googleAuthState.isSignedIn) {
      await GoogleDrive.verifySignedIn();
     }
    showSection('google');
   };

  const backendTab = document.createElement('button');
  backendTab.appendChild(createIcon('server', 16));
  const backendTabText = document.createElement('span');
  backendTabText.className = 'ytls-tab-text';
  backendTabText.textContent = ' TKB';
  backendTab.appendChild(backendTabText);
  addTooltip(backendTab, 'Timekeeper backend backup settings');
  backendTab.classList.add('ytls-settings-modal-button');
  backendTab.onclick = () => showSection('backend');

  nav.appendChild(generalTab);
  nav.appendChild(googleTab);
  nav.appendChild(backendTab);

  header.appendChild(nav);
  header.appendChild(closeButton);
  modal.appendChild(header);

   // Build General section
  generalSection.className = 'ytls-button-grid';
  generalSection.appendChild(
    createButton('Save', 'Save As...', config.saveBtnOnClick, 'device-floppy'),
   );
  generalSection.appendChild(
    createButton('Load', 'Load', config.loadBtnOnClick, 'folder-open'),
   );
  generalSection.appendChild(
    createButton(
       'Export All',
       'Export All Data',
      config.exportBtnOnClick,
       'file-export',
     ),
   );
  generalSection.appendChild(
    createButton(
       'Import All',
       'Import All Data',
      config.importBtnOnClick,
       'file-import',
     ),
   );
  generalSection.appendChild(
    createButton(
       'Export All (CSV)',
       'Export All Timestamps to CSV',
      async () => {
        try {
          await TimestampModel.exportAllTimestampsCsv();
         } catch (err) {
          showToast('Failed to export CSV: Could not read from database.');
         }
       },
       'file-spreadsheet',
     ),
   );

   // Build Google Drive section
  const signButton = createButton(
    GoogleDrive.googleAuthState.isSignedIn ? 'Sign Out' : 'Sign In',
    GoogleDrive.googleAuthState.isSignedIn
       ? 'Sign out from Google Drive'
       : 'Sign in to Google Drive',
    async () => {
      if (GoogleDrive.googleAuthState.isSignedIn) {
        await GoogleDrive.signOutFromGoogle();
        await GoogleDrive.scheduleAutoBackup();
       } else {
        await GoogleDrive.signInToGoogle();
       }
        await GoogleDrive.scheduleAutoBackup();
      setIconLabel(
        signButton,
        GoogleDrive.googleAuthState.isSignedIn ? 'logout' : 'login',
        GoogleDrive.googleAuthState.isSignedIn ? 'Sign Out' : 'Sign In',
       );
      addTooltip(
        signButton,
        GoogleDrive.googleAuthState.isSignedIn
           ? 'Sign out from Google Drive'
           : 'Sign in to Google Drive',
       );
      GoogleDrive.updateBackupStatusDisplay();
     },
    GoogleDrive.googleAuthState.isSignedIn ? 'logout' : 'login',
   );

  const autoToggleButton = createButton(
    GoogleDrive.getAutoBackupEnabled()
       ? 'Auto Backup: On'
       : 'Auto Backup: Off',
     'Toggle Auto Backup',
    async () => {
      await GoogleDrive.toggleAutoBackup();
      refreshBackupButtons();
      GoogleDrive.updateBackupStatusDisplay();
     },
     'refresh',
   );

  const intervalButton = createButton(
     `Backup Interval: ${GoogleDrive.getAutoBackupIntervalMinutes()}min`,
     'Set periodic backup interval (minutes)',
    async () => {
      await GoogleDrive.setAutoBackupIntervalPrompt();
      refreshBackupButtons();
      GoogleDrive.updateBackupStatusDisplay();
     },
     'clock-plus',
   );

  const backendToggleButton = createButton(
    GoogleDrive.getTimekeeperBackendBackupEnabled()
       ? 'Backend: On'
       : 'Backend: Off',
     'Toggle Timekeeper backend backup',
    async () => {
      await GoogleDrive.toggleTimekeeperBackendBackup();
      refreshBackupButtons();
     },
     'server',
   );

  const backendHostButton = createButton(
     `Backend Host: ${GoogleDrive.getTimekeeperBackendHost()}`,
     'Set the Timekeeper backend host',
    async () => {
      await GoogleDrive.setTimekeeperBackendHostPrompt();
      refreshBackupButtons();
     },
     'world',
   );

  const backendPortButton = createButton(
     `Backend Port: ${GoogleDrive.getTimekeeperBackendPort()}`,
     'Set the Timekeeper backend port',
    async () => {
      await GoogleDrive.setTimekeeperBackendPortPrompt();
      refreshBackupButtons();
     },
     'plug-connected',
   );

  const backendTokenButton = createButton(
    GoogleDrive.getTimekeeperBackendBearerToken()
       ? 'Backend Token: Set'
       : 'Backend Token: Missing',
     'Set or clear the Timekeeper backend bearer token',
    async () => {
      await GoogleDrive.setTimekeeperBackendBearerTokenPrompt();
      refreshBackupButtons();
     },
     'key',
   );

  const refreshBackupButtons = () => {
    setIconLabel(
      signButton,
      GoogleDrive.googleAuthState.isSignedIn ? 'logout' : 'login',
      GoogleDrive.googleAuthState.isSignedIn ? 'Sign Out' : 'Sign In',
     );
    addTooltip(
      signButton,
      GoogleDrive.googleAuthState.isSignedIn
         ? 'Sign out from Google Drive'
         : 'Sign in to Google Drive',
     );
    setIconLabel(
      autoToggleButton,
       'refresh',
      GoogleDrive.getAutoBackupEnabled()
         ? 'Auto Backup: On'
         : 'Auto Backup: Off',
     );
    setIconLabel(
      intervalButton,
       'clock-plus',
       `Backup Interval: ${GoogleDrive.getAutoBackupIntervalMinutes()}min`,
     );
    setIconLabel(
      backendToggleButton,
       'server',
      GoogleDrive.getTimekeeperBackendBackupEnabled()
         ? 'Backend: On'
         : 'Backend: Off',
     );
    setIconLabel(
      backendHostButton,
       'world',
       `Backend Host: ${GoogleDrive.getTimekeeperBackendHost()}`,
     );
    setIconLabel(
      backendPortButton,
       'plug-connected',
       `Backend Port: ${GoogleDrive.getTimekeeperBackendPort()}`,
     );
    setIconLabel(
      backendTokenButton,
       'key',
      GoogleDrive.getTimekeeperBackendBearerToken()
         ? 'Backend Token: Set'
         : 'Backend Token: Missing',
     );
    if (
      typeof GoogleDrive.updateBackupStatusDisplay === 'function'
     ) {
      GoogleDrive.updateBackupStatusDisplay();
     }
   };

  googleSection.appendChild(signButton);
  googleSection.appendChild(autoToggleButton);
  googleSection.appendChild(intervalButton);

  backendSection.appendChild(backendToggleButton);
  backendSection.appendChild(backendHostButton);
  backendSection.appendChild(backendPortButton);
  backendSection.appendChild(backendTokenButton);

  googleSection.appendChild(
    createButton(
       'Backup Now',
       'Run a backup immediately',
      async () => {
        await GoogleDrive.runAutoBackupOnce({
          silent: false,
          skipBackoff: true,
         });
        refreshBackupButtons();
       },
       'database',
     ),
   );

   // Add status info displays at the bottom
  const infoContainer = document.createElement('div');
  infoContainer.style.marginTop = '15px';
  infoContainer.style.paddingTop = '10px';
  infoContainer.style.borderTop = '1px solid #555';
  infoContainer.style.fontSize = '12px';
  infoContainer.style.color = '#aaa';

   // Sign-in status indicator
  const statusDiv = document.createElement('div');
  statusDiv.style.marginBottom = '8px';
  statusDiv.style.fontWeight = 'bold';
  infoContainer.appendChild(statusDiv);
  GoogleDrive.setAuthStatusDisplay(statusDiv);

   // User info
  const userInfoDiv = document.createElement('div');
  userInfoDiv.style.marginBottom = '8px';
  GoogleDrive.setGoogleUserDisplay(userInfoDiv);
  infoContainer.appendChild(userInfoDiv);

   // Backup status info
  const backupInfoDiv = document.createElement('div');
  GoogleDrive.setBackupStatusDisplay(backupInfoDiv);
  infoContainer.appendChild(backupInfoDiv);

  googleSection.appendChild(infoContainer);

   // Update status display based on sign-in state
  GoogleDrive.updateAuthStatusDisplay();
  GoogleDrive.updateGoogleUserDisplay();
  GoogleDrive.updateBackupStatusDisplay();
  refreshBackupButtons();

   // Append sections
  settingsContent.appendChild(sectionHeading);
  settingsContent.appendChild(generalSection);
  settingsContent.appendChild(googleSection);
  settingsContent.appendChild(backendSection);
  const normalizedInitialTab =
    initialTab === 'drive' ? 'google' : initialTab;
  showSection(normalizedInitialTab);

  modal.appendChild(settingsContent);
  document.body.appendChild(modal);

   // Calculate centered position and fix top edge
  requestAnimationFrame(() => {
    const rect = modal.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const centeredTop = (viewportHeight - rect.height) / 2;
    modal.style.top = `${Math.max(20, centeredTop)}px`;
    modal.style.transform = 'translateX(-50%)';
   });

   // Register click-outside and escape key listeners
  setTimeout(() => {
    document.addEventListener(
       'click',
      handleClickOutsideSettingsModal,
      true,
     );
    document.addEventListener('keydown', handleSettingsModalEscape);
   }, 0);

  return modal as HTMLDivElement;
}

// ============================================================================
// EVENT HANDLERS (registered on document)
// These use module-level variables set by initSettingsModal.
// ============================================================================

function handleSettingsModalEscape(event: KeyboardEvent) {
  if (
    event.key === 'Escape' &&
    settingsModalInstance &&
    settingsModalInstance.parentNode === document.body
   ) {
    const saveModal = document.getElementById('ytls-save-modal');
    const loadModal = document.getElementById('ytls-load-modal');
    const deleteModal = document.getElementById('ytls-delete-all-modal');
    if (saveModal || loadModal || deleteModal) {
      return;
     }

    event.preventDefault();

    closeAllSubdialogs();

    settingsModalInstance.classList.remove('ytls-fade-in');
    settingsModalInstance.classList.add('ytls-fade-out');
    setTimeout(() => {
      if (document.body.contains(settingsModalInstance)) {
        document.body.removeChild(settingsModalInstance);
       }
      settingsModalInstance = null;
      document.removeEventListener(
         'click',
        handleClickOutsideSettingsModal,
        true,
       );
      document.removeEventListener('keydown', handleSettingsModalEscape);
     }, 300);
   }
}

function handleClickOutsideSettingsModal(event: MouseEvent) {
  if (
    settingsCogButtonElement &&
     (event.target instanceof Node) &&
    settingsCogButtonElement.contains(event.target)
   ) {
    return;
   }

  const saveModal = document.getElementById('ytls-save-modal');
  const loadModal = document.getElementById('ytls-load-modal');
  const deleteModal = document.getElementById('ytls-delete-all-modal');

  const clickedInsideAnyModal =
     (saveModal && saveModal.contains(event.target as Node)) ||
     (loadModal && loadModal.contains(event.target as Node)) ||
     (deleteModal && deleteModal.contains(event.target as Node)) ||
     (settingsModalInstance &&
      settingsModalInstance.contains(event.target as Node));

  if (!clickedInsideAnyModal) {
    closeAllSubdialogs();

    if (
      settingsModalInstance &&
      settingsModalInstance.parentNode === document.body
     ) {
      settingsModalInstance.classList.remove('ytls-fade-in');
      settingsModalInstance.classList.add('ytls-fade-out');
      setTimeout(() => {
        if (document.body.contains(settingsModalInstance)) {
          document.body.removeChild(settingsModalInstance);
         }
        settingsModalInstance = null;
        document.removeEventListener(
           'click',
          handleClickOutsideSettingsModal,
          true,
         );
        document.removeEventListener('keydown', handleSettingsModalEscape);
       }, 300);
     }
   }
}
