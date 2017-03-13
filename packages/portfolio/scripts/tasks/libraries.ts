// Populates libraries
import * as fs from 'fs';
import { database } from '../../../backend/src/db';

type Publication = {
  link: string,
  badges: {
    name: string,
    url: string
  }[],
  gallery: string[],
  abstract: string
}