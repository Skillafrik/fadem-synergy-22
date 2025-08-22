
import { useState, useEffect, useCallback } from 'react';

// Hook générique pour le stockage local avec logging amélioré
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedValue = item ? JSON.parse(item) : initialValue;
      console.log(`[LocalStorage] Lecture réussie pour ${key}:`, parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(`[LocalStorage] Erreur lecture pour ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`[LocalStorage] Tentative d'écriture pour ${key}:`, valueToStore);
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`[LocalStorage] Écriture réussie pour ${key}`);
    } catch (error) {
      console.error(`[LocalStorage] Erreur écriture pour ${key}:`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      console.log(`[LocalStorage] Suppression réussie pour ${key}`);
    } catch (error) {
      console.error(`[LocalStorage] Erreur suppression pour ${key}:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook spécialisé pour les données FADEM avec backup automatique et debugging amélioré
export function useFademStorage<T>(module: string, initialData: T) {
  const storageKey = `fadem_${module}`;
  const [data, setData, removeData] = useLocalStorage(storageKey, initialData);

  // Version améliorée avec logging
  const setDataWithLog = useCallback((value: T | ((val: T) => T)) => {
    console.log(`[FADEM] ${module} - Début de la sauvegarde`);
    setData(value);
  }, [setData, module]);

  // Sauvegarde automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (data !== initialData) {
        const backup = {
          data,
          timestamp: new Date().toISOString(),
          module
        };
        try {
          localStorage.setItem(`fadem_backup_${module}`, JSON.stringify(backup));
          console.log(`[FADEM] Backup automatique créé pour ${module}`);
        } catch (error) {
          console.error(`[FADEM] Erreur backup pour ${module}:`, error);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [data, initialData, module]);

  // Fonction de restauration depuis backup
  const restoreFromBackup = useCallback(() => {
    try {
      const backup = localStorage.getItem(`fadem_backup_${module}`);
      if (backup) {
        const { data: backupData } = JSON.parse(backup);
        setDataWithLog(backupData);
        console.log(`[FADEM] Restauration réussie pour ${module}`);
        return true;
      }
    } catch (error) {
      console.error(`[FADEM] Erreur restauration backup ${module}:`, error);
    }
    return false;
  }, [module, setDataWithLog]);

  // Export des données
  const exportData = useCallback(() => {
    const exportObj = {
      module,
      data,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportObj, null, 2);
  }, [module, data]);

  // Import des données
  const importData = useCallback((jsonString: string) => {
    try {
      const importObj = JSON.parse(jsonString);
      if (importObj.module === module && importObj.data) {
        setDataWithLog(importObj.data);
        console.log(`[FADEM] Import réussi pour ${module}`);
        return true;
      }
    } catch (error) {
      console.error(`[FADEM] Erreur import données ${module}:`, error);
    }
    return false;
  }, [module, setDataWithLog]);

  return {
    data,
    setData: setDataWithLog,
    removeData,
    restoreFromBackup,
    exportData,
    importData
  };
}
