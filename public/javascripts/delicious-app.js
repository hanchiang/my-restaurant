import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import makeMap from './modules/map';
import searchStore from './modules/searchStore';
import heartStore from './modules/heart';

autocomplete($('#address'));

makeMap($('#map'));

searchStore($('input.search__input'));

heartStore($$('form.heart'));