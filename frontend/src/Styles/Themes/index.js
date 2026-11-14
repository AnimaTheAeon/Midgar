import * as blades from './blades';
import * as boxofx from './boxofx';
import * as midgar from './midgar';

// Midgar has three looks: the FFVII menu, "Box of X" and "Blades". Sonarr's old theme
// names all map to the FFVII menu so saved settings keep working.
export default {
  auto: midgar,
  light: midgar,
  dark: midgar,
  midgar,
  boxofx,
  blades
};
