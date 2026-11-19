import * as blades from './blades';
import * as boxofx from './boxofx';
import * as glass from './glass';
import * as midgar from './midgar';

// MC360 pages keep the Blades colors: white text on see-through panes.
const mc360 = blades;

// Midgar has five looks: the FFVII menu, "Xbox", "Blades", "Dark Glass" and "MC360". Sonarr's old theme
// names all map to the FFVII menu so saved settings keep working.
export default {
  auto: midgar,
  light: midgar,
  dark: midgar,
  midgar,
  boxofx,
  blades,
  glass,
  mc360
};
