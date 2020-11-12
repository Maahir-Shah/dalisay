import React from "react";
import {handleActions} from 'redux-actions';
import keplerGlReducer, {visStateUpdaters} from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { connect, Provider, useDispatch } from "react-redux";
import KeplerGl from "kepler.gl";
import { ActionTypes, addDataToMap, addLayer } from "kepler.gl/actions";
import {processGeojson} from 'kepler.gl/processors';
import {processCsvData} from 'kepler.gl/processors';
import useSwr from "swr";

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

/*
const composedUpdaters = {
  [ActionTypes.LAYER_CLICK]: (state, action) => {
    console.log('logging vis state', action);
  }
};
const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  return reducers(state, action);
};
*/

var ALACollabOrgs = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"Organization Name":"Eco-Quartier/YMCA","Organization type":"1","Code":"SO01","Latitude":"45.478343","Longitude":"-73.551853","Address":"255 Avenue Ash, Montreal, QC H3K 2R1","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.551853,45.478343]}},{"type":"Feature","properties":{"Organization Name":"CRCS St-Zotique","Organization type":"1","Code":"SO02","Latitude":"45.473064","Longitude":"-73.583711","Address":"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.583711,45.473064]}},{"type":"Feature","properties":{"Organization Name":"Maison D'Entreaide Ville Emard/Cote Saint Paul","Organization type":"1","Code":"SO03","Latitude":"45.457816","Longitude":"-73.582391","Address":"5999 Rue Drake, Montreal, QC H4E 4G8","Coverage Area":"Markets, reduced contribution and solitarity grocery stores: Ville-Émard and Côte-Saint-Paul: postal codes starting by H4E, others: Montréal Island"},"geometry":{"type":"Point","coordinates":[-73.582391,45.457816]}},{"type":"Feature","properties":{"Organization Name":"Jardin Communautaire Pointe-Verte","Organization type":"2","Code":"SO04","Latitude":"45.477366","Longitude":"-73.564420","Address":"Rue Knox & Rue Charlevoix, Ahuntsic-Cartierville, Montréal, QC H3K 2Y6"},"geometry":{"type":"Point","coordinates":[-73.56442,45.477366]}},{"type":"Feature","properties":{"Organization Name":"Action Gardien","Organization type":"1","Code":"SO05","Latitude":"45.476968","Longitude":"-73.563022","Address":"2390 de Ryde Street, Suite 203, Montréal, QC, H3K 1R6","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.563022,45.476968]}},{"type":"Feature","properties":{"Organization Name":"Mission of the great Shepherd","Organization type":"1","Code":"SO06","Latitude":"45.478924","Longitude":"-73.568314","Address":"2510 Centre St, Montreal, QC H3K 1J8","Coverage Area":"Montréal "},"geometry":{"type":"Point","coordinates":[-73.568314,45.478924]}},{"type":"Feature","properties":{"Organization Name":"Compost Montréal","Organization type":"3","Code":"SO07","Latitude":"45.477127","Longitude":"-73.581227","Address":"209A Rue Maria, Montréal, QC H4C 2N9"},"geometry":{"type":"Point","coordinates":[-73.581227,45.477127]}},{"type":"Feature","properties":{"Organization Name":"Coalition Petite Bourgogne/Marché Citoyen","Organization type":"1","Code":"SO08","Latitude":"45.489161","Longitude":"-73.572095","Address":"741 Rue des Seigneurs, Montreal, QC H3J 1Y2","Coverage Area":"Petite-Bourgogne and Griffintown "},"geometry":{"type":"Point","coordinates":[-73.572095,45.489161]}},{"type":"Feature","properties":{"Organization Name":"Mission Bon Accueil","Organization type":"1","Code":"SO09","Latitude":"45.472713","Longitude":"-73.591561","Address":"4755 Rue Acorn, Montreal, QC H4C 3L6","Coverage Area":"Grand Montréal"},"geometry":{"type":"Point","coordinates":[-73.591561,45.472713]}},{"type":"Feature","properties":{"Organization Name":"Maison du Partage d'Youville","Organization type":"1","Code":"SO10","Latitude":"45.477791","Longitude":"-73.561915","Address":"2221 Rue de Coleraine, Montreal, QC H3K 1S2","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.561915,45.477791]}},{"type":"Feature","properties":{"Organization Name":"Maison de Jeunes de PSC L'Adozone","Organization type":"1","Code":"SO11","Latitude":"45.481343","Longitude":"-73.561665","Address":"1850 Rue Grand Trunk, Montreal, QC H3K 1N9","Coverage Area":"Pointe-Saint-Charles and surroundings"},"geometry":{"type":"Point","coordinates":[-73.561665,45.481343]}},{"type":"Feature","properties":{"Organization Name":"Maison de Jeunes L'Escampette","Organization type":"1","Code":"SO12","Latitude":"45.484598","Longitude":"-73.573456","Address":"525 Rue Dominion, Montreal, QC H3J 2B4","Coverage Area":"Petite-Bourgogne"},"geometry":{"type":"Point","coordinates":[-73.573456,45.484598]}},{"type":"Feature","properties":{"Organization Name":"Club Populaire des Consommateurs","Organization type":"1","Code":"SO13","Latitude":"45.481327","Longitude":"-73.561369","Address":"1945 Mullins Street, Suite 30, Le Sud-Ouest, Montréal, QC, H3K 1N9","Coverage Area":"Le Sud-Ouest, priority to Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"DESTA Black Youth Network","Organization type":"1","Code":"SO14","Latitude":"45.489574","Longitude":"-73.575462","Address":"1950 Saint-Antoine St W, Montreal, QC H3J 1A5","Coverage Area":"Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.575462,45.489574]}},{"type":"Feature","properties":{"Organization Name":"Share the warmth/Partageons l'espoir","Organization type":"1","Code":"SO15","Latitude":"45.478148","Longitude":"-73.559401","Address":"625 Rue Fortune, Montreal, QC H3K 2R9","Coverage Area":"Le Sud-Ouest, Verdun, school children: Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.559401,45.478148]}},{"type":"Feature","properties":{"Organization Name":"Pro-Vert Sud Ouest","Organization type":"1","Code":"SO16","Latitude":"45.473064","Longitude":"-73.583711","Address":"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1"},"geometry":{"type":"Point","coordinates":[-73.583711,45.473064]}},{"type":"Feature","properties":{"Organization Name":"Batiment 7 / Collectif 7 à nous","Organization type":"1","Code":"SO17","Latitude":"45.480983","Longitude":"-73.552513","Address":"1900 Le Ber Street, Montréal, QC, H3K 2A4","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.552513,45.480983]}},{"type":"Feature","properties":{"Organization Name":"Saint Columba House","Organization type":"1","Code":"SO18","Latitude":"45.478913","Longitude":"-73.565399","Address":"2365 Rue Grand Trunk, Montreal, QC H3K 1M8","Coverage Area":"Pointe-Saint-Charles and surroundings"},"geometry":{"type":"Point","coordinates":[-73.565399,45.478913]}},{"type":"Feature","properties":{"Organization Name":"Craig Sauvé/Projet Montreal","Organization type":"2","Code":"SO19","Latitude":"45.516466","Longitude":"-73.555281","Address":"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5"},"geometry":{"type":"Point","coordinates":[-73.555281,45.516466]}},{"type":"Feature","properties":{"Organization Name":"Atelier 850","Organization type":"1","Code":"SO20","Latitude":"45.489280","Longitude":"-73.574739","Address":"810 Chatham Street, Le Sud-Ouest, Montréal, QC, H3J 1Y5","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.574739,45.48928]}},{"type":"Feature","properties":{"Organization Name":"Le Garde Manger pour Tous","Organization type":"1","Code":"SO21","Latitude":"45.489670","Longitude":"-73.573177","Address":"755 Rue des Seigneurs, Montréal, QC H3J 1Y2","Coverage Area":"Petite-Bourgogne, Saint-Henri, Verdun, Le Sud-Ouest and surroundings"},"geometry":{"type":"Point","coordinates":[-73.573177,45.48967]}},{"type":"Feature","properties":{"Organization Name":"CEDA (Comité d'éducation aux adultes)","Organization type":"1","Code":"SO22","Latitude":"45.483830","Longitude":"-73.576727","Address":"2515 Rue Delisle, Montréal, QC H3J 1K8","Coverage Area":"Le Sud-Ouest, Christmas baskets: postal code starting with H3J"},"geometry":{"type":"Point","coordinates":[-73.576727,45.48383]}},{"type":"Feature","properties":{"Organization Name":"Centre Communautaire Saint-Antoine 50+","Organization type":"1","Code":"SO23","Latitude":"45.487648","Longitude":"-73.578020","Address":"2338 Rue Saint-Antoine Ouest, Montreal, Québec H3J 1A8","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.57802,45.487648]}},{"type":"Feature","properties":{"Organization Name":"Amitié soleil","Organization type":"1","Code":"SO24","Latitude":"45.488821","Longitude":"-73.573129","Address":"715 Rue Chatham, Montréal, QC H3J 1Z3","Coverage Area":"Petite-Bourgogne, Saint-Henri and surrounding neighbourhoods"},"geometry":{"type":"Point","coordinates":[-73.573129,45.488821]}},{"type":"Feature","properties":{"Organization Name":"ACHIM","Organization type":"1","Code":"SO25","Latitude":"45.459226","Longitude":"-73.596029","Address":"5940 Boulevard Monk, Montréal, QC H4E 3H4","Coverage Area":"Côte Saint-Paul, Verdun, Ville-Émard"},"geometry":{"type":"Point","coordinates":[-73.596029,45.459226]}},{"type":"Feature","properties":{"Organization Name":"Famijeunes","Organization type":"1","Code":"SO26","Latitude":"45.478307","Longitude":"-73.582902","Address":"3904 Notre-Dame St W, Montreal, Quebec H4C 1R1","Coverage Area":"Saint-Henri, La Petite-Bourgogne"},"geometry":{"type":"Point","coordinates":[-73.582902,45.478307]}},{"type":"Feature","properties":{"Organization Name":"Jardin communautaire Bons Voisin","Organization type":"2","Code":"SO27","Latitude":"45.478058","Longitude":"-73.579810","Address":"Rue Turgeon et Rue Sainte-Emilie, Rivière-des-Prairies-Pointe-aux-Trembles, Montreal, QC H4C 1Z7"},"geometry":{"type":"Point","coordinates":[-73.57981,45.478058]}},{"type":"Feature","properties":{"Organization Name":"Jardin communautaire Des Seigneurs","Organization type":"2","Code":"SO28","Latitude":"45.489187","Longitude":"-73.572130","Address":"719 Rue des Seigneurs, Montréal, QC H3J 1Y2"},"geometry":{"type":"Point","coordinates":[-73.57213,45.489187]}},{"type":"Feature","properties":{"Organization Name":"Jardin comunautaire de la Petite-Bourgogne","Organization type":"2","Code":"SO29","Latitude":"45.487039","Longitude":"-73.575670","Address":"2263 Rue Quesnel, Montréal, QC H3J 1G3"},"geometry":{"type":"Point","coordinates":[-73.57567,45.487039]}},{"type":"Feature","properties":{"Organization Name":"Jardin communautaire Angrignon","Organization type":"2","Code":"SO30","Latitude":"45.444520","Longitude":"-73.601732","Address":"3400 Boulevard des Trinitaires. Montreal, QC H4E 4J3"},"geometry":{"type":"Point","coordinates":[-73.601732,45.44452]}},{"type":"Feature","properties":{"Organization Name":"Maison Benedict Labre","Organization type":"1","Code":"SO31","Latitude":"45.474142","Longitude":"-73.588203","Address":"4561 Notre-Dame St W, Montreal, Quebec H4C 1S3","Coverage Area":"Montréal Island"},"geometry":{"type":"Point","coordinates":[-73.588203,45.474142]}},{"type":"Feature","properties":{"Organization Name":"Milieu Educatif La Source","Organization type":"1","Code":"SO32","Latitude":"45.473064","Longitude":"-73.583711","Address":"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1","Coverage Area":"Saint-Henri and surroundings"},"geometry":{"type":"Point","coordinates":[-73.583711,45.473064]}},{"type":"Feature","properties":{"Organization Name":"ROPASOM","Organization type":"1","Code":"SO33","Latitude":"45.469063","Longitude":"-73.594945","Address":"5335 Notre-Dame St W, Montreal, Quebec H4C 3L3","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.594945,45.469063]}},{"type":"Feature","properties":{"Organization Name":"Concertation Saint Paul/Emard","Organization type":"1","Code":"SO35","Latitude":"45.454701","Longitude":"-73.594824","Address":"6389 Boulevard Monk, Montreal, QC H4E 3H8","Coverage Area":"Ville-Émard and Côte Saint-Paul "},"geometry":{"type":"Point","coordinates":[-73.594824,45.454701]}},{"type":"Feature","properties":{"Organization Name":"Equipe Mobile en Alimentation","Organization type":"1","Code":"SO36","Latitude":"45.490199","Longitude":"-73.573166","Address":"1845 St Jacques St, Montreal, Quebec H3J 1H1"},"geometry":{"type":"Point","coordinates":[-73.573166,45.490199]}},{"type":"Feature","properties":{"Organization Name":"Action Santé","Organization type":"1","Code":"SO37","Latitude":"45.474343","Longitude":"-73.561613","Address":"2423 Rue Wellington, Montreal, QC H3K 1X5","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.561613,45.474343]}},{"type":"Feature","properties":{"Organization Name":"Association Cooperative d'Economie Familiale (ACEF)","Organization type":"1","Code":"SO38","Latitude":"45.451574","Longitude":"-73.593161","Address":"6734 Boulevard Monk, Montréal, QC H4E 3J1","Coverage Area":"Sud-ouest de l'île de Montréal: Baie d'Urfé, Beaconsfield, Côte-des-Neiges-Notre-Dame-de-Grâce, Côte Saint-Luc, Dorval, Hampstead, Kirkland, Lachine-Saint-Pierre, LaSalle, Montréal-Ouest, Ville Mont-Royal, Petite-Bourgogne, Pointe-Claire, Pointe-Saint-Charles, Saint-Henri, Saint-Laurent, Sainte-Anne-de-Bellevue, Senneville, Verdun, Ville-Émard, Côte-Saint-Paul, Ville-Marie, Westmount"},"geometry":{"type":"Point","coordinates":[-73.593161,45.451574]}},{"type":"Feature","properties":{"Organization Name":"Auberge communautaire du Sud-Ouest","Organization type":"1","Code":"SO39","Latitude":"45.463453","Longitude":"-73.566759","Address":"4026 Wellington St, Verdun, Quebec H4G 3M6","Coverage Area":"Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.566759,45.463453]}},{"type":"Feature","properties":{"Organization Name":"Carrefour D'5 Populaire Pointe St-Charles","Organization type":"1","Code":"SO40","Latitude":"45.479967","Longitude":"-73.566575","Address":"2356 Centre St, Montreal, Quebec H3K 1J7","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.566575,45.479967]}},{"type":"Feature","properties":{"Organization Name":"Centre Communautaire des Femmes Actives St-Henri","Organization type":"1","Code":"SO41","Latitude":"45.476047","Longitude":"-73.591696","Address":"4500 Saint-Antoine St W, Montreal, Quebec H4C 1E1","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.591696,45.476047]}},{"type":"Feature","properties":{"Organization Name":"Centre Culturel Georges-Vanier","Organization type":"1","Code":"SO42","Latitude":"45.483542","Longitude":"-73.575081","Address":"2450 Rue Workman, Montréal, QC H3J 1L8","Coverage Area":"Montréal "},"geometry":{"type":"Point","coordinates":[-73.575081,45.483542]}},{"type":"Feature","properties":{"Organization Name":"Clinique Communautaire du Pointe St-Charles","Organization type":"2","Code":"SO43","Latitude":"45.478353","Longitude":"-73.556841","Address":"500 Avenue Ash, Montréal, QC H3K 2R4","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.556841,45.478353]}},{"type":"Feature","properties":{"Organization Name":"Le Carrefour St-Henri","Organization type":"4","Code":"SO44","Latitude":"45.480374","Longitude":"-73.579811","Address":"3453 Rue Notre-Dame Ouest, Montreal, Québec H4C 1P4"},"geometry":{"type":"Point","coordinates":[-73.579811,45.480374]}},{"type":"Feature","properties":{"Organization Name":"CPE Les Petits Lutins de Cote St-Paul","Organization type":"6","Code":"SO45","Latitude":"45.457682","Longitude":"-73.598198","Address":"6050 Rue Hamilton, Montréal, QC H4E 3C3"},"geometry":{"type":"Point","coordinates":[-73.598198,45.457682]}},{"type":"Feature","properties":{"Organization Name":"Ecole St-Zotique","Organization type":"5","Code":"SO46","Latitude":"45.471139","Longitude":"-73.589291","Address":"4841 Avenue Palm, Montréal, QC H4C 1Y1"},"geometry":{"type":"Point","coordinates":[-73.589291,45.471139]}},{"type":"Feature","properties":{"Organization Name":"Ecole Charles Lemoyne","Organization type":"5","Code":"SO47","Latitude":"45.481327","Longitude":"-73.561369","Address":"2001 Rue Mullins, Montréal, QC H3K 1N9"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"Ecole Coeur-Immaculé-de-Marie","Organization type":"5","Code":"SO48","Latitude":"45.455903","Longitude":"-73.589635","Address":"1845 Boulevard Desmarchais, Montréal, QC H4E 2B7"},"geometry":{"type":"Point","coordinates":[-73.589635,45.455903]}},{"type":"Feature","properties":{"Organization Name":"James Lyng High School","Organization type":"5","Code":"SO49","Latitude":"45.468289","Longitude":"-73.595825","Address":"5440 Notre-Dame St W, Montreal, Quebec H4C 1T9"},"geometry":{"type":"Point","coordinates":[-73.595825,45.468289]}},{"type":"Feature","properties":{"Organization Name":"Solidarite St-Henri","Organization type":"1","Code":"SO50","Latitude":"45.473064","Longitude":"-73.583711","Address":"75 Square Sir-Georges-Étienne-Cartier, Suite 201, Montreal, QC H4C 3A1","Coverage Area":"Saint-Henri"},"geometry":{"type":"Point","coordinates":[-73.583711,45.473064]}},{"type":"Feature","properties":{"Organization Name":"Logifem","Organization type":"1","Code":"SO51","Latitude":"45.480223","Longitude":"-73.576858","Address":"CP 72108, 151 Atwater, Montréal, QC H3J 2Z6","Coverage Area":"Montréal Island"},"geometry":{"type":"Point","coordinates":[-73.576858,45.480223]}},{"type":"Feature","properties":{"Organization Name":"Centre des aines de Pointe St-Charles","Organization type":"1","Code":"SO52","Latitude":"45.480357","Longitude":"-73.568319","Address":"2431 St Charles St, Montreal, Quebec H3K 1E6","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.568319,45.480357]}},{"type":"Feature","properties":{"Organization Name":"Madame prend conge (centre des femmes Pt St-Charle)","Organization type":"1","Code":"SO53","Latitude":"45.481343","Longitude":"-73.561665","Address":"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9","Coverage Area":"Le Sud-Ouest, primarily Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.561665,45.481343]}},{"type":"Feature","properties":{"Organization Name":"Regroupement Information Logement (RIL)","Organization type":"1","Code":"SO54","Latitude":"45.481327","Longitude":"-73.561369","Address":"1945 Rue Mullins Bureau 110, Montréal, QC H3K 1N9","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"Ecole Jeanne-Leber","Organization type":"5","Code":"SO55","Latitude":"45.477250","Longitude":"-73.556208","Address":"2120 Rue Favard, Montréal, QC H3K 1Z7"},"geometry":{"type":"Point","coordinates":[-73.556208,45.47725]}},{"type":"Feature","properties":{"Organization Name":"St. Gabriel Elementary School","Organization type":"5","Code":"SO56","Latitude":"45.476808","Longitude":"-73.559003","Address":"600 Rue de Dublin, Montréal, QC H3K 2S4"},"geometry":{"type":"Point","coordinates":[-73.559003,45.476808]}},{"type":"Feature","properties":{"Organization Name":"Saint Gabriel's Parish","Organization type":"4","Code":"SO57","Latitude":"45.481169","Longitude":"-73.565544","Address":"2157 Centre St, Montreal, Quebec H3K 1J5"},"geometry":{"type":"Point","coordinates":[-73.565544,45.481169]}},{"type":"Feature","properties":{"Organization Name":"Mosquee Khadijah","Organization type":"4","Code":"SO58","Latitude":"45.480030","Longitude":"-73.567179","Address":"2385 Centre St, Montreal, Quebec H3K 1J6"},"geometry":{"type":"Point","coordinates":[-73.567179,45.48003]}},{"type":"Feature","properties":{"Organization Name":"RESO (Regroupment economique et social du Sud-Ouest)","Organization type":"1","Code":"SO59","Latitude":"45.483480","Longitude":"-73.580613","Address":"3181 St Jacques St, Montreal, Quebec H4C 1G7","Coverage Area":"Montréal Island, priority to the South-West"},"geometry":{"type":"Point","coordinates":[-73.580613,45.48348]}},{"type":"Feature","properties":{"Organization Name":"Centre africain de developpement et d'entraide","Organization type":"1","Code":"SO60","Latitude":"45.476968","Longitude":"-73.563022","Address":"202-2390 Rue Ryde, Montréal, QC H3K 1R6","Coverage Area":"Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.563022,45.476968]}},{"type":"Feature","properties":{"Organization Name":"Comite des sans emploi","Organization type":"1","Code":"SO61","Latitude":"45.478913","Longitude":"-73.565399","Address":"2365 Rue Grand Trunk, Montreal, Québec H3K 1M8","Coverage Area":"Pointe-Saint-Charles"},"geometry":{"type":"Point","coordinates":[-73.565399,45.478913]}},{"type":"Feature","properties":{"Organization Name":"Familles en action","Organization type":"1","Code":"SO62","Latitude":"45.482583","Longitude":"-73.562898","Address":"1915 Centre St, Montreal, Quebec H3K 1J1","Coverage Area":"Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.562898,45.482583]}},{"type":"Feature","properties":{"Organization Name":"P.O.P.I.R.--Comite Logement","Organization type":"1","Code":"SO63","Latitude":"45.483830","Longitude":"-73.576727","Address":"2515 Rue Delisle, suite 209, Montréal, QC H3J 1K8","Coverage Area":"Saint-Henri, Petite-Bourgogne, Griffintown, Ville-Émard, Côte-Saint-Paul"},"geometry":{"type":"Point","coordinates":[-73.576727,45.48383]}},{"type":"Feature","properties":{"Organization Name":"Maison Partage Petite-Bourgogne Réseau Providence","Organization type":"1","Code":"SO64","Latitude":"45.490075","Longitude":"-73.569622","Address":"550 Avenue Richmond, Montreal, Québec H3J 1V3"},"geometry":{"type":"Point","coordinates":[-73.569622,45.490075]}},{"type":"Feature","properties":{"Organization Name":"Services juridique communautaires","Organization type":"1","Code":"SO65","Latitude":"45.478852","Longitude":"-73.569128","Address":"2533 Rue Centre, bureau 101, Montréal, QC H3K 1J9","Coverage Area":"Pointe-Saint-Charles, Petite-Bourgogne, Griffintown"},"geometry":{"type":"Point","coordinates":[-73.569128,45.478852]}},{"type":"Feature","properties":{"Organization Name":"Societe d'histoire de Pointe-St-Charles","Organization type":"1","Code":"SO66","Latitude":"45.476968","Longitude":"-73.563022","Address":"206-2390 Rue Ryde, Montréal, QC H3K 1R6"},"geometry":{"type":"Point","coordinates":[-73.563022,45.476968]}},{"type":"Feature","properties":{"Organization Name":"Travail de rue-Action communautaire (TRAC)","Organization type":"1","Code":"SO67","Latitude":"45.473064","Longitude":"-73.583711","Address":"75, square Sir-George-Étienne-Cartier, bureau 212, Montréal, QC, H4C 3A1","Coverage Area":"Le Sud-Ouest, Verdun, Lachine"},"geometry":{"type":"Point","coordinates":[-73.583711,45.473064]}},{"type":"Feature","properties":{"Organization Name":"Ecole Roslyn","Organization type":"5","Code":"SO68","Latitude":"45.483197","Longitude":"-73.609436","Address":"4699 Westmount Ave, Westmount, Quebec H3Y 1X5"},"geometry":{"type":"Point","coordinates":[-73.609436,45.483197]}},{"type":"Feature","properties":{"Organization Name":"Ecole Westmount Park","Organization type":"5","Code":"SO69","Latitude":"45.480923","Longitude":"-73.594697","Address":"15 Park Pl, Westmount, Quebec H3Z 2K4"},"geometry":{"type":"Point","coordinates":[-73.594697,45.480923]}},{"type":"Feature","properties":{"Organization Name":"Union United Church","Organization type":"4","Code":"SO70","Latitude":"45.482402","Longitude":"-73.579198","Address":"3007 Rue Delisle, Montréal, QC H4C 1M8"},"geometry":{"type":"Point","coordinates":[-73.579198,45.482402]}},{"type":"Feature","properties":{"Organization Name":"Paroisse Saint-Charles","Organization type":"4","Code":"SO71","Latitude":"45.481487","Longitude":"-73.565004","Address":"2115 Centre St, Montreal, Quebec H3K 1J5","Coverage Area":"Pointe-Saint-Charles only"},"geometry":{"type":"Point","coordinates":[-73.565004,45.481487]}},{"type":"Feature","properties":{"Organization Name":"Les Ateliers 5 Epices","Organization type":"1","Code":"SO72","Latitude":"45.481327","Longitude":"-73.561369","Address":"1945 Rue Mullins, Montréal, QC H3K 1N9","Coverage Area":"Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"Ecole Secondaire St-Henri","Organization type":"5","Code":"SO73","Latitude":"45.477965","Longitude":"-73.587573","Address":"4115 St Jacques St, Montreal, Quebec H4C 1J3"},"geometry":{"type":"Point","coordinates":[-73.587573,45.477965]}},{"type":"Feature","properties":{"Organization Name":"Centre Communautaire Tyndale St-Georges","Organization type":"1","Code":"SO74","Latitude":"45.491275","Longitude":"-73.573116","Address":"870 Square Richmond, Montréal, QC H3J 1V7","Coverage Area":"Petite-Bourgogne"},"geometry":{"type":"Point","coordinates":[-73.573116,45.491275]}},{"type":"Feature","properties":{"Organization Name":"Prevention Sud-Ouest (PSO)","Organization type":"1","Code":"SO75","Latitude":"45.460997","Longitude":"-73.608874","Address":"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5","Coverage Area":"Côte-Saint-Paul, Griffintown, Petite-Bourgogne, Pointe-Saint-Charles, Saint-Henri et Ville-Émard"},"geometry":{"type":"Point","coordinates":[-73.608874,45.460997]}},{"type":"Feature","properties":{"Organization Name":"Ecole de la Petite-Bourgogne","Organization type":"5","Code":"SO76","Latitude":"45.488643","Longitude":"-73.570996","Address":"555 Rue des Seigneurs, Montréal, QC H3J 1Y1"},"geometry":{"type":"Point","coordinates":[-73.570996,45.488643]}},{"type":"Feature","properties":{"Organization Name":"Centre d'aide a la reussite et au developpement","Organization type":"1","Code":"SO77","Latitude":"45.446850","Longitude":"-73.600711","Address":"3225 Trinitaires Blvd, Suite 1, Montreal, Quebec H4E 2S4","Coverage Area":"Ville-Émard and Côte Saint-Paul"},"geometry":{"type":"Point","coordinates":[-73.600711,45.44685]}},{"type":"Feature","properties":{"Organization Name":"Centre de Loisirs Monseigneur Pigeon","Organization type":"1","Code":"SO78","Latitude":"45.462799","Longitude":"-73.584212","Address":"5550 Rue Angers, Montréal, QC H4E 4A5","Coverage Area":"Greater Montréal"},"geometry":{"type":"Point","coordinates":[-73.584212,45.462799]}},{"type":"Feature","properties":{"Organization Name":"Centre social d'aide aux immigrants, CSAI","Organization type":"1","Code":"SO79","Latitude":"45.456838","Longitude":"-73.588719","Address":"6201 Laurendeau St, Montreal, Quebec H4E 3X8","Coverage Area":"Montréal Island"},"geometry":{"type":"Point","coordinates":[-73.588719,45.456838]}},{"type":"Feature","properties":{"Organization Name":"Maison Repit Oasis","Organization type":"1","Code":"SO80","Latitude":"45.459979","Longitude":"-73.590949","Address":"1960 Rue Cardinal, Montréal, QC H4E 1N5","Coverage Area":"Respite: Montréal Island, l'Envolée: Le Sud-Ouest"},"geometry":{"type":"Point","coordinates":[-73.590949,45.459979]}},{"type":"Feature","properties":{"Organization Name":"L'Arche Montreal","Organization type":"1","Code":"SO81","Latitude":"45.455770","Longitude":"-73.602536","Address":"6105 Rue Jogues, Montréal, QC H4E 2W2","Coverage Area":"Montréal Island"},"geometry":{"type":"Point","coordinates":[-73.602536,45.45577]}},{"type":"Feature","properties":{"Organization Name":"Groupes de ressources techniques Batir son quartier","Organization type":"1","Code":"SO82","Latitude":"45.481327","Longitude":"-73.561369","Address":"1945 Rue Mullins bureau 120, Montreal, Quebec H3K 1N9","Coverage Area":"Montréal Island, Longueuil"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"CPE Les enfants de l'avenir","Organization type":"6","Code":"SO83","Latitude":"45.481327","Longitude":"-73.561369","Address":"1945 Rue Mullins bureau 180, Montréal, QC H3K 1N9"},"geometry":{"type":"Point","coordinates":[-73.561369,45.481327]}},{"type":"Feature","properties":{"Organization Name":"Ecole Victor-Rousselot","Organization type":"5","Code":"SO84","Latitude":"45.479363","Longitude":"-73.578792","Address":"3525 Sainte Émilie St, Montreal, Quebec H4C 1Z3"},"geometry":{"type":"Point","coordinates":[-73.578792,45.479363]}},{"type":"Feature","properties":{"Organization Name":"Imani Community Centre/Muslim Association","Organization type":"4","Code":"SO85","Latitude":"45.490177","Longitude":"-73.568710","Address":"552 Ave Richmond, Montreal, Quebec H3J 1V3"},"geometry":{"type":"Point","coordinates":[-73.56871,45.490177]}},{"type":"Feature","properties":{"Organization Name":"Ecole Annexe-Charlevoix","Organization type":"5","Code":"SO86","Latitude":"45.474409","Longitude":"-73.591834","Address":"633 Courcelle St, Montreal, Quebec H4C 3C7"},"geometry":{"type":"Point","coordinates":[-73.591834,45.474409]}},{"type":"Feature","properties":{"Organization Name":"Club de Gymnastique Artistique Gadbois","Organization type":"1","Code":"SO87","Latitude":"45.479773","Longitude":"-73.577321","Address":"155 Avenue Greene 2e étage, Montréal, QC H4C 2H6"},"geometry":{"type":"Point","coordinates":[-73.577321,45.479773]}},{"type":"Feature","properties":{"Organization Name":"Centre Saint Paul","Organization type":"5","Code":"SO88","Latitude":"45.470801","Longitude":"-73.590224","Address":"4976 Notre-Dame St W, Montreal, Quebec H4C 1S8"},"geometry":{"type":"Point","coordinates":[-73.590224,45.470801]}},{"type":"Feature","properties":{"Organization Name":"Projet Suivi Communautaire","Organization type":"1","Code":"SO89","Latitude":"45.484122","Longitude":"-73.562062","Address":"1751, rue Richardson, bureau 4.120 Montréal (Québec) H3K 1G6","Coverage Area":"Verdun, LaSalle, Ville-Émard, Côte-Saint-Paul, Pointe-Saint-Charles, Lachine, Saint-Henri, Petite-Bourgogne"},"geometry":{"type":"Point","coordinates":[-73.562062,45.484122]}},{"type":"Feature","properties":{"Organization Name":"CPE Enfants Soleil","Organization type":"6","Code":"SO90","Latitude":"45.461733","Longitude":"-73.587809","Address":"5656 Laurendeau St, Montreal, Quebec H4E 3W4"},"geometry":{"type":"Point","coordinates":[-73.587809,45.461733]}},{"type":"Feature","properties":{"Organization Name":"CPE le Joyeux Carrousel","Organization type":"6","Code":"SO91","Latitude":"45.451403","Longitude":"-73.594775","Address":"6715 Rue Beaulieu, Montréal, QC H4E 3G2"},"geometry":{"type":"Point","coordinates":[-73.594775,45.451403]}},{"type":"Feature","properties":{"Organization Name":"Jardin Rose de Lima","Organization type":"2","Code":"SO92","Latitude":"45.481606","Longitude":"-73.580664","Address":"3467 Rue Delisle, Montréal, QC H4C 1N1"},"geometry":{"type":"Point","coordinates":[-73.580664,45.481606]}},{"type":"Feature","properties":{"Organization Name":"Ecole des Metiers du Sud-Ouest de Montreal","Organization type":"5","Code":"SO93","Latitude":"45.477166","Longitude":"-73.587112","Address":"717 Rue Saint-Ferdinand, Montreal, Quebec H4C 3L7"},"geometry":{"type":"Point","coordinates":[-73.587112,45.477166]}},{"type":"Feature","properties":{"Organization Name":"Ecole Saint-Jean-de-Matha","Organization type":"5","Code":"SO94","Latitude":"45.448380","Longitude":"-73.596567","Address":"6970 Rue Dumas, Montréal, QC H4E 3A3"},"geometry":{"type":"Point","coordinates":[-73.596567,45.44838]}},{"type":"Feature","properties":{"Organization Name":"Ecole Honore-Mercier","Organization type":"5","Code":"SO95","Latitude":"45.455946","Longitude":"-73.591841","Address":"1935 Boulevard Desmarchais, Montréal, QC H4E 2B9"},"geometry":{"type":"Point","coordinates":[-73.591841,45.455946]}},{"type":"Feature","properties":{"Organization Name":"Ecole NDPS","Organization type":"5","Code":"SO96","Latitude":"45.458211","Longitude":"-73.596686","Address":"6025 Rue Beaulieu, Montréal, QC H4E 3E7"},"geometry":{"type":"Point","coordinates":[-73.596686,45.458211]}},{"type":"Feature","properties":{"Organization Name":"Bible Way Pentecostal Church","Organization type":"4","Code":"SO97","Latitude":"45.486506","Longitude":"-73.577870","Address":"2390 Rue Coursol, Montréal, QC H3J 1C7","Coverage Area":"Petite-Bourgogne"},"geometry":{"type":"Point","coordinates":[-73.57787,45.486506]}},{"type":"Feature","properties":{"Organization Name":"Shah Jalal Islamic Centre","Organization type":"4","Code":"SO98","Latitude":"45.479431","Longitude":"-73.582536","Address":"3740 Rue Workman, Montréal, QC H4C 1N8"},"geometry":{"type":"Point","coordinates":[-73.582536,45.479431]}},{"type":"Feature","properties":{"Organization Name":"Eglise St-Zotique","Organization type":"4","Code":"SO99","Latitude":"45.474142","Longitude":"-73.588203","Address":"4565 Notre-Dame St W, Montreal, Quebec H4C 1S3"},"geometry":{"type":"Point","coordinates":[-73.588203,45.474142]}},{"type":"Feature","properties":{"Organization Name":"Gurudwara Sahib Quebec","Organization type":"4","Code":"SO100","Latitude":"45.476787","Longitude":"-73.559936","Address":"2183 Wellington St, Montreal, Quebec H3K 1X1"},"geometry":{"type":"Point","coordinates":[-73.559936,45.476787]}},{"type":"Feature","properties":{"Organization Name":"CLSC","Organization type":"2","Code":"P18","Latitude":"45.480584","Longitude":"-73.578872","Address":"3382 Rue Notre-Dame Ouest, Montreal, QC H4C 1P8"},"geometry":{"type":"Point","coordinates":[-73.578872,45.480584]}}]}

var CollabsNetwork = `Origin,Origin_name,Origin_address,Origin_latitude,Origin_longitude,Destination,Destination_name,Destination_address,Destination_latitude,Destination_longitude
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO04,Jardin Communautaire Pointe-Verte,"Rue Knox & Rue Charlevoix, Ahuntsic-Cartierville, Montréal, QC H3K 2Y6",45.477365999999996,-73.56442
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO04,Jardin Communautaire Pointe-Verte,"Rue Knox & Rue Charlevoix, Ahuntsic-Cartierville, Montréal, QC H3K 2Y6",45.477365999999996,-73.56442
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO04,Jardin Communautaire Pointe-Verte,"Rue Knox & Rue Charlevoix, Ahuntsic-Cartierville, Montréal, QC H3K 2Y6",45.477365999999996,-73.56442
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915
  SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665
  SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915,SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401
  SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO06,Mission of the great Shepherd,"2510 Centre St, Montreal, QC H3K 1J8",45.478924,-73.568314,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO07,Compost Montréal,"209A Rue Maria, Montréal, QC H4C 2N9",45.477127,-73.581227,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001
  SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915,SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001
  SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462,SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO05,Action Gardien,"2533 Rue du Centre, Montreal, QC H3K 1J9",45.478734,-73.568586,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO10,Maison du Partage d'Youville,"2221 Rue de Coleraine, Montreal, QC H3K 1S2",45.477790999999996,-73.561915,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO14,DESTA Black Youth Network,"1950 Saint-Antoine St W, Montreal, QC H3J 1A5",45.489574,-73.575462,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO22,CEDA (Comité d'éducation aux adultes),"2515 Rue Delisle, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO22,CEDA (Comité d'éducation aux adultes),"2515 Rue Delisle, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO22,CEDA (Comité d'éducation aux adultes),"2515 Rue Delisle, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO22,CEDA (Comité d'éducation aux adultes),"2515 Rue Delisle, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO22,CEDA (Comité d'éducation aux adultes),"2515 Rue Delisle, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO23,Centre Communautaire Saint-Antoine 50+,"2338 Rue Saint-Antoine Ouest, Montreal, Québec H3J 1A8",45.487648,-73.57802
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO23,Centre Communautaire Saint-Antoine 50+,"2338 Rue Saint-Antoine Ouest, Montreal, Québec H3J 1A8",45.487648,-73.57802
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO23,Centre Communautaire Saint-Antoine 50+,"2338 Rue Saint-Antoine Ouest, Montreal, Québec H3J 1A8",45.487648,-73.57802
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO23,Centre Communautaire Saint-Antoine 50+,"2338 Rue Saint-Antoine Ouest, Montreal, Québec H3J 1A8",45.487648,-73.57802
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO24,Amitié soleil,"715 Rue Chatham, Montréal, QC H3J 1Z3",45.488821,-73.57312900000001
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO24,Amitié soleil,"715 Rue Chatham, Montréal, QC H3J 1Z3",45.488821,-73.57312900000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO24,Amitié soleil,"715 Rue Chatham, Montréal, QC H3J 1Z3",45.488821,-73.57312900000001
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO24,Amitié soleil,"715 Rue Chatham, Montréal, QC H3J 1Z3",45.488821,-73.57312900000001
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO24,Amitié soleil,"715 Rue Chatham, Montréal, QC H3J 1Z3",45.488821,-73.57312900000001
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO25,ACHIM,"5940 Boulevard Monk, Montréal, QC H4E 3H4",45.459226,-73.596029
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO25,ACHIM,"5940 Boulevard Monk, Montréal, QC H4E 3H4",45.459226,-73.596029
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO25,ACHIM,"5940 Boulevard Monk, Montréal, QC H4E 3H4",45.459226,-73.596029
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO26,Famijeunes,"3904 Notre-Dame St W, Montreal, Quebec H4C 1R1",45.478307,-73.582902
  SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561,SO26,Famijeunes,"3904 Notre-Dame St W, Montreal, Quebec H4C 1R1",45.478307,-73.582902
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO26,Famijeunes,"3904 Notre-Dame St W, Montreal, Quebec H4C 1R1",45.478307,-73.582902
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO26,Famijeunes,"3904 Notre-Dame St W, Montreal, Quebec H4C 1R1",45.478307,-73.582902
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO27,Jardin communautaire Bons Voisin,"Rue Turgeon et Rue Sainte-Emilie, Rivière-des-Prairies-Pointe-aux-Trembles, Montreal, QC H4C 1Z7",45.478058000000004,-73.57981
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO27,Jardin communautaire Bons Voisin,"Rue Turgeon et Rue Sainte-Emilie, Rivière-des-Prairies-Pointe-aux-Trembles, Montreal, QC H4C 1Z7",45.478058000000004,-73.57981
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO28,Jardin communautaire Des Seigneurs,"719 Rue des Seigneurs, Montréal, QC H3J 1Y2",45.489187,-73.57213
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO28,Jardin communautaire Des Seigneurs,"719 Rue des Seigneurs, Montréal, QC H3J 1Y2",45.489187,-73.57213
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO28,Jardin communautaire Des Seigneurs,"719 Rue des Seigneurs, Montréal, QC H3J 1Y2",45.489187,-73.57213
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO28,Jardin communautaire Des Seigneurs,"719 Rue des Seigneurs, Montréal, QC H3J 1Y2",45.489187,-73.57213
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO29,Jardin comunautaire de la Petite-Bourgogne,"2263 Rue Quesnel, Montréal, QC H3J 1G3",45.487039,-73.57567
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO29,Jardin comunautaire de la Petite-Bourgogne,"2263 Rue Quesnel, Montréal, QC H3J 1G3",45.487039,-73.57567
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO29,Jardin comunautaire de la Petite-Bourgogne,"2263 Rue Quesnel, Montréal, QC H3J 1G3",45.487039,-73.57567
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO29,Jardin comunautaire de la Petite-Bourgogne,"2263 Rue Quesnel, Montréal, QC H3J 1G3",45.487039,-73.57567
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO30,Jardin communautaire Angrignon,"3400 Boulevard des Trinitaires. Montreal, QC H4E 4J3",45.444520000000004,-73.601732
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO30,Jardin communautaire Angrignon,"3400 Boulevard des Trinitaires. Montreal, QC H4E 4J3",45.444520000000004,-73.601732
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO30,Jardin communautaire Angrignon,"3400 Boulevard des Trinitaires. Montreal, QC H4E 4J3",45.444520000000004,-73.601732
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO30,Jardin communautaire Angrignon,"3400 Boulevard des Trinitaires. Montreal, QC H4E 4J3",45.444520000000004,-73.601732
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO31,Maison Benedict Labre,"4561 Notre-Dame St W, Montreal, Quebec H4C 1S3",45.474142,-73.58820300000001
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO31,Maison Benedict Labre,"4561 Notre-Dame St W, Montreal, Quebec H4C 1S3",45.474142,-73.58820300000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO31,Maison Benedict Labre,"4561 Notre-Dame St W, Montreal, Quebec H4C 1S3",45.474142,-73.58820300000001
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO32,Milieu Educatif La Source,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711,SO32,Milieu Educatif La Source,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO32,Milieu Educatif La Source,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO33,ROPASOM,"5335 Notre-Dame St W, Montreal, Quebec H4C 3L3",45.469063,-73.594945
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO33,ROPASOM,"5335 Notre-Dame St W, Montreal, Quebec H4C 3L3",45.469063,-73.594945
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO33,ROPASOM,"5335 Notre-Dame St W, Montreal, Quebec H4C 3L3",45.469063,-73.594945
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO34,Le Comité des Citoyens du Village des Tanneries,Dsibanded,,
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO34,Le Comité des Citoyens du Village des Tanneries,Dsibanded,,
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO35,Concertation Saint Paul/Emard,"6389 Boulevard Monk, Montreal, QC H4E 3H8",45.454701,-73.594824
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO35,Concertation Saint Paul/Emard,"6389 Boulevard Monk, Montreal, QC H4E 3H8",45.454701,-73.594824
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO35,Concertation Saint Paul/Emard,"6389 Boulevard Monk, Montreal, QC H4E 3H8",45.454701,-73.594824
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO36,Equipe Mobile en Alimentation,"1845 St Jacques St, Montreal, Quebec H3J 1H1",45.490199,-73.573166
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO36,Equipe Mobile en Alimentation,"1845 St Jacques St, Montreal, Quebec H3J 1H1",45.490199,-73.573166
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO36,Equipe Mobile en Alimentation,"1845 St Jacques St, Montreal, Quebec H3J 1H1",45.490199,-73.573166
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO36,Equipe Mobile en Alimentation,"1845 St Jacques St, Montreal, Quebec H3J 1H1",45.490199,-73.573166
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO37,Action Santé,"2423 Rue Wellington, Montreal, QC H3K 1X5",45.474343,-73.561613
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO37,Action Santé,"2423 Rue Wellington, Montreal, QC H3K 1X5",45.474343,-73.561613
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO38,Association Cooperative d'Economie Familiale (ACEF),"5955 Rue de Marseille, Montréal, QC H1N 1K6",45.574884000000004,-73.542303
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO38,Association Cooperative d'Economie Familiale (ACEF),"5955 Rue de Marseille, Montréal, QC H1N 1K6",45.574884000000004,-73.542303
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO38,Association Cooperative d'Economie Familiale (ACEF),"5955 Rue de Marseille, Montréal, QC H1N 1K6",45.574884000000004,-73.542303
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO38,Association Cooperative d'Economie Familiale (ACEF),"5955 Rue de Marseille, Montréal, QC H1N 1K6",45.574884000000004,-73.542303
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO38,Association Cooperative d'Economie Familiale (ACEF),"5955 Rue de Marseille, Montréal, QC H1N 1K6",45.574884000000004,-73.542303
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO39,Auberge communautaire du Sud-Ouest,"4026 Wellington St, Verdun, Quebec H4G 3M6",45.463453,-73.56675899999999
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO39,Auberge communautaire du Sud-Ouest,"4026 Wellington St, Verdun, Quebec H4G 3M6",45.463453,-73.56675899999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO39,Auberge communautaire du Sud-Ouest,"4026 Wellington St, Verdun, Quebec H4G 3M6",45.463453,-73.56675899999999
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO40,Carrefour D'5 Populaire Pointe St-Charles,"2356 Centre St, Montreal, Quebec H3K 1J7",45.479966999999995,-73.566575
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO41,Centre Communautaire des Femmes Actives St-Henri,"4500 Saint-Antoine St W, Montreal, Quebec H4C 1E1",45.476046999999994,-73.591696
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO41,Centre Communautaire des Femmes Actives St-Henri,"4500 Saint-Antoine St W, Montreal, Quebec H4C 1E1",45.476046999999994,-73.591696
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO41,Centre Communautaire des Femmes Actives St-Henri,"4500 Saint-Antoine St W, Montreal, Quebec H4C 1E1",45.476046999999994,-73.591696
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO42,Centre Culturel Georges-Vanier,"2450 Rue Workman, Montréal, QC H3J 1L8",45.483542,-73.57508100000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO42,Centre Culturel Georges-Vanier,"2450 Rue Workman, Montréal, QC H3J 1L8",45.483542,-73.57508100000001
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO42,Centre Culturel Georges-Vanier,"2450 Rue Workman, Montréal, QC H3J 1L8",45.483542,-73.57508100000001
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO43,Clinique Communautaire du Pointe St-Charles,"500 Avenue Ash, Montréal, QC H3K 2R4",45.478353000000006,-73.556841
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO44,Le Carrefour St-Henri,"3453 Rue Notre-Dame Ouest, Montreal, Québec H4C 1P4",45.480374,-73.57981099999999
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO45,CPE Les Petits Lutins de Cote St-Paul,"6050 Rue Hamilton, Montréal, QC H4E 3C3",45.457682,-73.598198
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO45,CPE Les Petits Lutins de Cote St-Paul,"6050 Rue Hamilton, Montréal, QC H4E 3C3",45.457682,-73.598198
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO46,Ecole St-Zotique,"4841 Avenue Palm, Montréal, QC H4C 1Y1",45.471139,-73.589291
  SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711,SO46,Ecole St-Zotique,"4841 Avenue Palm, Montréal, QC H4C 1Y1",45.471139,-73.589291
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO46,Ecole St-Zotique,"4841 Avenue Palm, Montréal, QC H4C 1Y1",45.471139,-73.589291
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO47,Ecole Charles Lemoyne,"2001 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO48,Ecole Coeur-Immaculé-de-Marie,"1845 Boulevard Desmarchais, Montréal, QC H4E 2B7",45.455903,-73.589635
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO48,Ecole Coeur-Immaculé-de-Marie,"1845 Boulevard Desmarchais, Montréal, QC H4E 2B7",45.455903,-73.589635
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO49,James Lyng High School,"5440 Notre-Dame St W, Montreal, Quebec H4C 1T9",45.468289,-73.595825
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO49,James Lyng High School,"5440 Notre-Dame St W, Montreal, Quebec H4C 1T9",45.468289,-73.595825
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO49,James Lyng High School,"5440 Notre-Dame St W, Montreal, Quebec H4C 1T9",45.468289,-73.595825
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO50,Solidarite St-Henri,"75 Square Sir-Georges-Étienne-Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711
  SO01,Eco-Quartier/YMCA,"255 Avenue Ash, Montreal, QC H3K 2R1",45.478343,-73.55185300000001,SO51,Logifem,"CP72108, 151 Atwater, Montréal, QC H3J 2Z6",45.480222999999995,-73.576858
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO51,Logifem,"CP72108, 151 Atwater, Montréal, QC H3J 2Z6",45.480222999999995,-73.576858
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO51,Logifem,"CP72108, 151 Atwater, Montréal, QC H3J 2Z6",45.480222999999995,-73.576858
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO52,Centre des aines de Pointe St-Charles,"2431 St Charles St, Montreal, Quebec H3K 1E6",45.480357,-73.56831899999999
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO53,Madame prend conge (centre des femmes Pt St-Charle),"1900, rue Grand Trunk Montreal, QC, Canada H3K1N9",45.481343,-73.561665
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO54,Regroupement Information Logement (RIL),"1945 Rue Mullins Bureau 110, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO54,Regroupement Information Logement (RIL),"1945 Rue Mullins Bureau 110, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO55,Ecole Jeanne-Leber,"2120 Rue Favard, Montréal, QC H3K 1Z7",45.47725,-73.556208
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO55,Ecole Jeanne-Leber,"2120 Rue Favard, Montréal, QC H3K 1Z7",45.47725,-73.556208
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO55,Ecole Jeanne-Leber,"2120 Rue Favard, Montréal, QC H3K 1Z7",45.47725,-73.556208
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO55,Ecole Jeanne-Leber,"2120 Rue Favard, Montréal, QC H3K 1Z7",45.47725,-73.556208
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO56,St. Gabriel Elementary School,"600 Rue de Dublin, Montréal, QC H3K 2S4",45.476808,-73.559003
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO56,St. Gabriel Elementary School,"600 Rue de Dublin, Montréal, QC H3K 2S4",45.476808,-73.559003
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO57,Saint Gabriel's Parish,"2157 Centre St, Montreal, Quebec H3K 1J5",45.481169,-73.56554399999999
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO57,Saint Gabriel's Parish,"2157 Centre St, Montreal, Quebec H3K 1J5",45.481169,-73.56554399999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO57,Saint Gabriel's Parish,"2157 Centre St, Montreal, Quebec H3K 1J5",45.481169,-73.56554399999999
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO58,Mosquee Khadijah,"2385 Centre St, Montreal, Quebec H3K 1J6",45.48003,-73.56717900000001
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO58,Mosquee Khadijah,"2385 Centre St, Montreal, Quebec H3K 1J6",45.48003,-73.56717900000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO58,Mosquee Khadijah,"2385 Centre St, Montreal, Quebec H3K 1J6",45.48003,-73.56717900000001
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO59,RESO (Regroupment economique et social du Sud-Oues,"3181 St Jacques St, Montreal, Quebec H4C 1G7",45.48348,-73.580613
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO60,Centre africain de developpement et d'entraide,"202-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO60,Centre africain de developpement et d'entraide,"202-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO60,Centre africain de developpement et d'entraide,"202-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO61,Comite des sans emploi,"2365 Rue Grand Trunk, Montreal, Québec H3K 1M8",45.478913,-73.565399
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO61,Comite des sans emploi,"2365 Rue Grand Trunk, Montreal, Québec H3K 1M8",45.478913,-73.565399
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO62,Familles en action,"1915 Centre St, Montreal, Quebec H3K 1J1",45.482583,-73.562898
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO62,Familles en action,"1915 Centre St, Montreal, Quebec H3K 1J1",45.482583,-73.562898
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO62,Familles en action,"1915 Centre St, Montreal, Quebec H3K 1J1",45.482583,-73.562898
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO62,Familles en action,"1915 Centre St, Montreal, Quebec H3K 1J1",45.482583,-73.562898
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO62,Familles en action,"1915 Centre St, Montreal, Quebec H3K 1J1",45.482583,-73.562898
  SO02,CRCS St-Zotique,"75 Rue du Square Sir George Étienne Cartier, Montréal, QC H4C 3A1",45.473064,-73.583711,SO63,P.O.P.I.R.--Comite Logement,"2515 Rue Delisle bureau 209, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO63,P.O.P.I.R.--Comite Logement,"2515 Rue Delisle bureau 209, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO63,P.O.P.I.R.--Comite Logement,"2515 Rue Delisle bureau 209, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO63,P.O.P.I.R.--Comite Logement,"2515 Rue Delisle bureau 209, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO63,P.O.P.I.R.--Comite Logement,"2515 Rue Delisle bureau 209, Montréal, QC H3J 1K8",45.48383,-73.576727
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO64,Maison Partage Petite-Bourgogne Réseau Providence,"550 Avenue Richmond, Montreal, Québec H3J 1V3",45.490075,-73.569622
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO64,Maison Partage Petite-Bourgogne Réseau Providence,"550 Avenue Richmond, Montreal, Québec H3J 1V3",45.490075,-73.569622
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO65,Services juridique communautaires,"2533 Rue Centre bureau 101, Montréal, QC H3K 1J9",45.478852,-73.569128
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO65,Services juridique communautaires,"2533 Rue Centre bureau 101, Montréal, QC H3K 1J9",45.478852,-73.569128
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO65,Services juridique communautaires,"2533 Rue Centre bureau 101, Montréal, QC H3K 1J9",45.478852,-73.569128
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO66,Societe d'histoire de Pointe-St-Charles,"206-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO66,Societe d'histoire de Pointe-St-Charles,"206-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO66,Societe d'histoire de Pointe-St-Charles,"206-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO66,Societe d'histoire de Pointe-St-Charles,"206-2390 Rue Ryde, Montréal, QC H3K 1R6",45.476968,-73.563022
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO67,Travail de rue-Action communautaire (TRAC),"400 Rue de l'Église, Montréal, QC H4G 3E4",45.462587,-73.569356
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO68,Ecole Roslyn,"4699 Westmount Ave, Westmount, Quebec H3Y 1X5",45.483197,-73.609436
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO69,Ecole Westmount Park,"15 Park Pl, Westmount, Quebec H3Z 2K4",45.480923,-73.594697
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO70,Union United Church,"3007 Rue Delisle, Montréal, QC H4C 1M8",45.482402,-73.579198
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO70,Union United Church,"3007 Rue Delisle, Montréal, QC H4C 1M8",45.482402,-73.579198
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO70,Union United Church,"3007 Rue Delisle, Montréal, QC H4C 1M8",45.482402,-73.579198
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO71,Paroisse Saint-Charles,"2111 Centre St, Montreal, Quebec H3K 1J5",45.481487,-73.565004
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO71,Paroisse Saint-Charles,"2111 Centre St, Montreal, Quebec H3K 1J5",45.481487,-73.565004
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO71,Paroisse Saint-Charles,"2111 Centre St, Montreal, Quebec H3K 1J5",45.481487,-73.565004
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO71,Paroisse Saint-Charles,"2111 Centre St, Montreal, Quebec H3K 1J5",45.481487,-73.565004
  SO15,Share the warmth/Partageons l'espoir,"625 Rue Fortune, Montreal, QC H3K 2R9",45.478148,-73.559401,SO72,Les Ateliers 5 Epices,"1945 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO72,Les Ateliers 5 Epices,"1945 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO72,Les Ateliers 5 Epices,"1945 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO72,Les Ateliers 5 Epices,"1945 Rue Mullins, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO73,Ecole Secondaire St-Henri,"4115 St Jacques St, Montreal, Quebec H4C 1J3",45.477965000000005,-73.58757299999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO73,Ecole Secondaire St-Henri,"4115 St Jacques St, Montreal, Quebec H4C 1J3",45.477965000000005,-73.58757299999999
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO74,Centre Communautaire Tyndale St-Georges,"870 Square Richmond, Montréal, QC H3J 1V7",45.491275,-73.573116
  SO11,Maison de Jeunes de PSC L'Adozone,"1850 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO74,Centre Communautaire Tyndale St-Georges,"870 Square Richmond, Montréal, QC H3J 1V7",45.491275,-73.573116
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO74,Centre Communautaire Tyndale St-Georges,"870 Square Richmond, Montréal, QC H3J 1V7",45.491275,-73.573116
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO74,Centre Communautaire Tyndale St-Georges,"870 Square Richmond, Montréal, QC H3J 1V7",45.491275,-73.573116
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO74,Centre Communautaire Tyndale St-Georges,"870 Square Richmond, Montréal, QC H3J 1V7",45.491275,-73.573116
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO75,Prevention Sud-Ouest (PSO),"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5",45.460997,-73.608874
  SO08,Coalition Petite Bourgogne/Marché Citoyen,"741 Rue des Seigneurs, Montreal, QC H3J 1Y2",45.489160999999996,-73.57209499999999,SO75,Prevention Sud-Ouest (PSO),"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5",45.460997,-73.608874
  SO12,Maison de Jeunes L'Escampette,"525 Rue Dominion, Montreal, QC H3J 2B4",45.484598,-73.57345600000001,SO75,Prevention Sud-Ouest (PSO),"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5",45.460997,-73.608874
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO75,Prevention Sud-Ouest (PSO),"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5",45.460997,-73.608874
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO75,Prevention Sud-Ouest (PSO),"6000 rue Notre-Dame Ouest West entrance, 2nd floor, Montreal, Quebec, H4C 3K5",45.460997,-73.608874
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO76,Ecole de la Petite-Bourgogne,"555 Rue des Seigneurs, Montréal, QC H3J 1Y1",45.488642999999996,-73.570996
  SO20,Atelier 850,"850 Rue des Seigneurs, Montréal, QC H3J 1Y5",45.490185,-73.574646,SO76,Ecole de la Petite-Bourgogne,"555 Rue des Seigneurs, Montréal, QC H3J 1Y1",45.488642999999996,-73.570996
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO76,Ecole de la Petite-Bourgogne,"555 Rue des Seigneurs, Montréal, QC H3J 1Y1",45.488642999999996,-73.570996
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO77,Centre d'aide a la reussite et au developpement,"3225 Trinitaires Blvd, Montreal, Quebec H4E 2S4",45.44685,-73.600711
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO77,Centre d'aide a la reussite et au developpement,"3225 Trinitaires Blvd, Montreal, Quebec H4E 2S4",45.44685,-73.600711
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO77,Centre d'aide a la reussite et au developpement,"3225 Trinitaires Blvd, Montreal, Quebec H4E 2S4",45.44685,-73.600711
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO78,Centre de Loisirs Monseigneur Pigeon,"5550 Rue Angers, Montréal, QC H4E 4A5",45.462799,-73.584212
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO78,Centre de Loisirs Monseigneur Pigeon,"5550 Rue Angers, Montréal, QC H4E 4A5",45.462799,-73.584212
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO78,Centre de Loisirs Monseigneur Pigeon,"5550 Rue Angers, Montréal, QC H4E 4A5",45.462799,-73.584212
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO79,"Centre social d'aide aux immigrants, CSAI","6201 Laurendeau St, Montreal, Quebec H4E 3X8",45.456838,-73.588719
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO79,"Centre social d'aide aux immigrants, CSAI","6201 Laurendeau St, Montreal, Quebec H4E 3X8",45.456838,-73.588719
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO79,"Centre social d'aide aux immigrants, CSAI","6201 Laurendeau St, Montreal, Quebec H4E 3X8",45.456838,-73.588719
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO80,Maison Repit Oasis,"1960 Rue Cardinal, Montréal, QC H4E 1N5",45.459979,-73.590949
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO80,Maison Repit Oasis,"1960 Rue Cardinal, Montréal, QC H4E 1N5",45.459979,-73.590949
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO80,Maison Repit Oasis,"1960 Rue Cardinal, Montréal, QC H4E 1N5",45.459979,-73.590949
  SO03,Maison D'Entreaide Ville Emard/Cote Saint Paul,"5999 Rue Drake, Montreal, QC H4E 4G8",45.457815999999994,-73.582391,SO81,L'Arche Montreal,"6105 Rue Jogues, Montréal, QC H4E 2W2",45.45577,-73.602536
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO81,L'Arche Montreal,"6105 Rue Jogues, Montréal, QC H4E 2W2",45.45577,-73.602536
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO81,L'Arche Montreal,"6105 Rue Jogues, Montréal, QC H4E 2W2",45.45577,-73.602536
  SO13,Club Populaire des Consommateurs,"1956 Rue Grand Trunk, Montreal, QC H3K 1N9",45.481343,-73.561665,SO82,Groupes de ressources techniques Batir son quartie,"1945 Rue Mullins bureau 120, Montreal, Quebec H3K 1N9",45.481327,-73.561369
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO82,Groupes de ressources techniques Batir son quartie,"1945 Rue Mullins bureau 120, Montreal, Quebec H3K 1N9",45.481327,-73.561369
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO82,Groupes de ressources techniques Batir son quartie,"1945 Rue Mullins bureau 120, Montreal, Quebec H3K 1N9",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO82,Groupes de ressources techniques Batir son quartie,"1945 Rue Mullins bureau 120, Montreal, Quebec H3K 1N9",45.481327,-73.561369
  SO17,Batiment 7 / Collectif 7 à nous,"1950 Rue du Centre, Montreal, QC H3K 1J2",45.482094000000004,-73.56312199999999,SO83,CPE Les enfants de l'avenir,"1945 Rue Mullins bureau 180, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO83,CPE Les enfants de l'avenir,"1945 Rue Mullins bureau 180, Montréal, QC H3K 1N9",45.481327,-73.561369
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO84,Ecole Victor-Rousselot,"3525 Sainte Émilie St, Montreal, Quebec H4C 1Z3",45.479363,-73.578792
  SO21,Le Garde Manger pour Tous,"1945 Rue Mullins, Montreal, QC H3K 1M7",45.481327,-73.561369,SO84,Ecole Victor-Rousselot,"3525 Sainte Émilie St, Montreal, Quebec H4C 1Z3",45.479363,-73.578792
  SO18,Saint Columba House,"2365 Rue Grand Trunk, Montreal, QC H3K 1M8",45.478913,-73.565399,SO85,Imani Community Centre/Muslim Association,"552 Ave Richmond, Montreal, Quebec H3J 1V3",45.490177,-73.56871
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO85,Imani Community Centre/Muslim Association,"552 Ave Richmond, Montreal, Quebec H3J 1V3",45.490177,-73.56871
  SO09,Mission Bon Accueil,"4755 Rue Acorn, Montreal, QC H4C 3L6",45.472713,-73.591561,SO86,Ecole Annexe-Charlevoix,"633 Courcelle St, Montreal, Quebec H4C 3C7",45.443826,-73.749215
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO87,Club de Gymnastique Artistique Gadbois,"155 Avenue Greene 2e étage, Montréal, QC H4C 2H6",45.479773,-73.577321
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO88,Centre Saint Paul,"4976 Notre-Dame St W, Montreal, Quebec H4C 1S8",45.470801,-73.59022399999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO88,Centre Saint Paul,"4976 Notre-Dame St W, Montreal, Quebec H4C 1S8",45.470801,-73.59022399999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO89,Projet Suivi Communautaire,"1751, rue Richardson, bureau 4.120 Montréal (Québec) H3K 1G6",45.484122,-73.562062
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO90,CPE Enfants Soleil,"5656 Laurendeau St, Montreal, Quebec H4E 3W4",45.461733,-73.587809
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO91,CPE le Joyeux Carrousel,"6715 Rue Beaulieu, Montréal, QC H4E 3G2",45.451403000000006,-73.594775
  SO16,Pro-Vert Sud Ouest,"75 Rue du Square Sir George Étienne Cartier, Montreal, QC H4C 3A1",45.473064,-73.583711,SO92,Jardin Rose de Lima,"3467 Rue Delisle, Montréal, QC H4C 1N1",45.481606,-73.580664
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO92,Jardin Rose de Lima,"3467 Rue Delisle, Montréal, QC H4C 1N1",45.481606,-73.580664
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO93,Ecole des Metiers du Sud-Ouest de Montreal,"2000 Rue Parthenais, Montréal, QC H2K 1V7",45.529709999999994,-73.557247
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO94,Ecole Saint-Jean-de-Matha,"6970 Rue Dumas, Montréal, QC H4E 3A3",45.44838,-73.59656700000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO95,Ecole Honore-Mercier,"1935 Boulevard Desmarchais, Montréal, QC H4E 2B9",45.455946000000004,-73.591841
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO96,Ecole NDPS,"6025 Rue Beaulieu, Montréal, QC H4E 3E7",45.458211,-73.596686
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO97,Bible Way Pentecostal Church,"2390 Rue Coursol, Montréal, QC H3J 1C7",45.486506,-73.57786999999999
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO98,Shah Jalal Islamic Centre,"3740 Rue Workman, Montréal, QC H4C 1N8",45.479431,-73.582536
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO99,Eglise St-Zotique,"4561 Notre-Dame St W, Montreal, Quebec H4C 1S3",45.474142,-73.58820300000001
  SO19,Craig Sauvé/Projet Montreal,"1055 Boulevard René-Lévesque E, suite 1100, Montréal, QC H2L 4S5",45.516465999999994,-73.55528100000001,SO100,Gurudwara Sahib Quebec,"2183 Wellington St, Montreal, Quebec H3K 1X1",45.476787,-73.559936
  `
var MapConfig = {
  "visState": {
    "filters": [],
    "layers": [
      {
        "id": "vqm2zgun",
        "type": "geojson",
        "config": {
          "dataId": "ALACollabOrgs",
          "label": "ALA Organizations",
          "color": [
            255,
            219,
            51
          ],
          "columns": {
            "geojson": "_geojson"
          },
          "isVisible": true,
          "visConfig": {
            "opacity": 0.8,
            "strokeOpacity": 0.8,
            "thickness": 0.5,
            "strokeColor": null,
            "colorRange": {
              "name": "Global Warming",
              "type": "sequential",
              "category": "Uber",
              "colors": [
                "#5A1846",
                "#900C3F",
                "#C70039",
                "#E3611C",
                "#F1920E",
                "#FFC300"
              ]
            },
            "strokeColorRange": {
              "name": "Global Warming",
              "type": "sequential",
              "category": "Uber",
              "colors": [
                "#5A1846",
                "#900C3F",
                "#C70039",
                "#E3611C",
                "#F1920E",
                "#FFC300"
              ]
            },
            "sizeRange": [
              0,
              10
            ],
            "radiusRange": [
              0,
              50
            ],
            "heightRange": [
              0,
              500
            ],
            "elevationScale": 5,
            "enable3d": false,
            "wireframe": false,
            "filled": true,
            "stroked": false,
            "radius": 8
          },
          "hidden": false,
          "textLabel": [
            {
              "field": null,
              "color": [
                255,
                255,
                255
              ],
              "size": 18,
              "offset": [
                0,
                0
              ],
              "anchor": "start",
              "alignment": "center"
            }
          ]
        },
        "visualChannels": {
          "colorField": null,
          "colorScale": "quantile",
          "strokeColorField": null,
          "strokeColorScale": "quantile",
          "sizeField": null,
          "sizeScale": "linear",
          "heightField": null,
          "heightScale": "linear",
          "radiusField": null,
          "radiusScale": "linear"
        }
      },
      {
        "id": "0htibxn",
        "type": "arc",
        "config": {
          "dataId": "CollabsNetwork",
          "label": "ALA Collaboration Network",
          "color": [
            71,
            211,
            217
          ],
          "columns": {
            "lat0": "Origin_latitude",
            "lng0": "Origin_longitude",
            "lat1": "Destination_latitude",
            "lng1": "Destination_longitude"
          },
          "isVisible": true,
          "visConfig": {
            "opacity": 0.8,
            "thickness": 2,
            "colorRange": {
              "name": "Global Warming",
              "type": "sequential",
              "category": "Uber",
              "colors": [
                "#5A1846",
                "#900C3F",
                "#C70039",
                "#E3611C",
                "#F1920E",
                "#FFC300"
              ]
            },
            "sizeRange": [
              0,
              10
            ],
            "targetColor": [
              44,
              22,
              133
            ]
          },
          "hidden": false,
          "textLabel": [
            {
              "field": null,
              "color": [
                255,
                255,
                255
              ],
              "size": 18,
              "offset": [
                0,
                0
              ],
              "anchor": "start",
              "alignment": "center"
            }
          ]
        },
        "visualChannels": {
          "colorField": null,
          "colorScale": "quantile",
          "sizeField": null,
          "sizeScale": "linear"
        }
      }
    ],
    "interactionConfig": {
      "tooltip": {
        "compareMode": false,
        "compareType": "absolute",
        "fieldsToShow": {
          "ALACollabOrgs": [
            {
              "name": "Organization Name",
              "format": null
            },
            {
              "name": "Organization type",
              "format": null
            },
            {
              "name": "Code",
              "format": null
            },
            {
              "name": "Latitude",
              "format": null
            },
            {
              "name": "Longitude",
              "format": null
            }
          ],
          "CollabsNetwork": [
            {
              "name": "Origin",
              "format": null
            },
            {
              "name": "Origin_name",
              "format": null
            },
            {
              "name": "Origin_address",
              "format": null
            },
            {
              "name": "Destination",
              "format": null
            },
            {
              "name": "Destination_name",
              "format": null
            }
          ]
        },
        "enabled": true
      },
      "brush": {
        "size": 0.5,
        "enabled": false
      },
      "geocoder": {
        "enabled": false
      },
      "coordinate": {
        "enabled": false
      }
    },
    "layerBlending": "normal",
    "splitMaps": [],
    "animationConfig": {
      "currentTime": null,
      "speed": 1
    }
  },
  "mapState": {
    "bearing": 0,
    "dragRotate": false,
    "latitude": 45.475253152393584,
    "longitude": -73.61293019757474,
    "pitch": 0,
    "zoom": 12.033545790912791,
    "isSplit": false
  },
  "mapStyle": {
    "styleType": "dark",
    "topLayerGroups": {},
    "visibleLayerGroups": {
      "label": true,
      "road": true,
      "border": false,
      "building": true,
      "water": true,
      "land": true,
      "3d building": false
    },
    "threeDBuildingColor": [
      9.665468314072013,
      17.18305478057247,
      31.1442867897876
    ],
    "mapStyles": {}
  }
}

class App extends React.Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };
  componentDidMount() {
    this.props.dispatch(
      addDataToMap({
        // datasets
        datasets: [{
          info: {
            label: 'ALA Organizations',
            id: 'ALACollabOrgs'
          },
          data: processGeojson(ALACollabOrgs)
        },{
          info: {
            label: 'ALA Collaboration Network',
            id: 'CollabsNetwork'
          },
          data: processCsvData(CollabsNetwork)
        }],
        // option
        option: {
          centerMap: true,
          readOnly: false
        },
        // config
        config: MapConfig
      })
  )
}

  render() {
    return <KeplerGl
id="SynthEco"
mapboxApiAccessToken={"pk.eyJ1IjoibWFhaGlyc2hhaCIsImEiOiJja2g4N3p5b3EwNzlrMnJwcHRwNWVmeGx4In0.VO3DiSwq9zoPuIxn_RjakQ"}
width={window.innerWidth}
height={window.innerHeight}/>
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);

/*
const composedReducer = (state, action) => {
  switch (action.type) {
    case 'LAYER_CLICK':
      console.log(action)
      return {
        ...state,
        keplerGl: {
          ...state.keplerGl,
          foo: {
             ...state.keplerGl.foo,
             visState: visStateUpdaters.layerClickUpdater(
               state.keplerGl.foo.visState,
               action
             )
          }
        }
      };
  }
  return reducers(state, action);
 };
 */