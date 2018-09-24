import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import makeMap from './modules/map';
import searchStore from './modules/searchStore';

autocomplete($('#address'));

makeMap($('#map'));

searchStore($('input.search__input'))