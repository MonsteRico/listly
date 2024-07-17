"use client";
import { useLocalStorage } from "usehooks-ts";

type LocalStorageKeys = "listly_listBoardIds";

export class LocalStorage {
  /**
   * Attempts to parse the local storage value at the provided `key`.
   * If there is no item in local storage it will return the provided defaultValue.
   * Take caution to always provide a default value if there is a chance that the local
   * storage entry will not exist.
   * @param key The key of the target entry in local storage
   * @returns
   */
  static getItem<T>(key: LocalStorageKeys, defaultValue?: T): T {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item) as T;
    return defaultValue as T;
  }

  /**
   *
   * @param key
   * @param defaultValue
   * @returns `[value, setValueFn]`
   */
  static useItem<T>(key: LocalStorageKeys, defaultValue: T) {
    return useLocalStorage(key, defaultValue);
  }

  /**
   * Sets an item un-reactively via localStorage.setItem(...).
   * The input value will be stringified and inserted into local storage.
   * If the stringified value is parseable JSON an error will be thrown
   * when attempting to retrive the value through other methods of this class.
   *
   * @param key The local storage entry key to set
   * @param value The value to set the key entry to
   */
  static setItem<T>(key: LocalStorageKeys, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
