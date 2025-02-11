import type { FC } from 'react';
import type { ThemeProviderProps, UseThemeProps } from "./types";

const client = require('./client')
const server = require('./server')

export const useTheme = client.useTheme as () => UseThemeProps;
export const ThemeProvider = client.ThemeProvider as FC<ThemeProviderProps>;
export const ServerThemeProvider = server.ServerThemeProvider as FC<ThemeProviderProps>;
