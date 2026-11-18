import * as blades from './blades';
import * as boxofx from './boxofx';
import * as glass from './glass';
import * as midgar from './midgar';

// Midgar has four looks: the FFVII menu, "Xbox", "Blades" and "Dark Glass". Sonarr's old theme
// names all map to the FFVII menu so saved settings keep working.
export default {
  auto: midgar,
  light: midgar,
  dark: midgar,
  midgar,
  boxofx,
  blades,
  glass
};
