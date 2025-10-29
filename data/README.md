# Data Card - interactive graph for life expectancy, average pension age and part of the population receiving pensions

## Sources
- Dataset 1 — STATEC, https://lustat.statec.lu/vis?lc=en&tm=life%20expectancy&pg=0&snb=3&df[ds]=ds-release&df[id]=DF_B2209&df[ag]=LU1&df[vs]=1.0&dq=S01..A&pd=1991%2C2023&to[TIME_PERIOD]=false, Identifier: DF_B2209 — License: CC0 1.0 [https://creativecommons.org/publicdomain/zero/1.0/legalcode.en]
- Dataset 2 — inspection générale de la sécurité sociale, https://download.data.public.lu/resources/series-statistiques-sur-les-pensions/20250620-105218/ap-2-145-rg-evoagemoypens-cat.xlsx, version/date: 20 juin 2025 —  — Licence: CC BY 3.0 LU [https://creativecommons.org/licenses/by/3.0/lu/]
- Dataset 3 - inspection générale de la sécurité sociale, https://data.public.lu/fr/datasets/r/14cc7614-c864-42c8-997e-de52dca22ef5, version/date — Licence: CC BY 3.0 LU [https://creativecommons.org/licenses/by/3.0/lu/]
- Dataset 4 - STATEC, https://lustat.statec.lu/vis?lc=en&tm=age&pg=0&snb=179&df[ds]=ds-release&df[id]=DF_B1102&df[ag]=LU1&df[vs]=1.0&dq=A..&pd=2014%2C2023&to[TIME_PERIOD]=false&isAvailabilityDisabled=false&lo=1&lom=LASTNOBSERVATIONS, Identifier: DF_B1102 — License: CC0 1.0 [https://statistiques.public.lu/en/support/notice.html]
- Dataset 5 - Registre national des personnes physiques RNPP : Pyramide d'âge par commune - population age pyramid per municipality - source: https://data.public.lu/en/datasets/registre-national-des-personnes-physiques-rnpp-pyramide-dage-par-commune-population-age-pyramid-per-municipality/#/resources - licence: CC BY 3.0 LU [https://creativecommons.org/licenses/by/3.0/lu/]
- Dataset 6 - Limites administratives du Grand-Duché de Luxembourg: [Administration du cadastre et de la topographie](https://data.public.lu/en/datasets/limites-administratives-du-grand-duche-de-luxembourg/), version/date: October 21, 2025 - licence: CC0 1.0 [https://creativecommons.org/publicdomain/zero/1.0/]
- Dataset 7 - Working Status by household status, marrital status, age and sex, https://lustat.statec.lu/vis?pg=0&snb=16&df[ds]=ds-release&df[id]=DSD_CENSUS_GROUP21_24%40DF_B1678&df[ag]=LU1&df[vs]=1.0&dq=..A10._T.Y65T84%2BY_GE85%2B_T.................&pd=2021%2C2021&to[TIME_PERIOD]=false&lc=en, Identifier: DSD_CENSUS_GROUP21_24@DF_B1678 , version: October 8, 2025 — License: CC0 1.0 [https://creativecommons.org/publicdomain/zero/1.0/]

## Scope & transformations
- Dataset 1: 
	- Time window: 1991-2023
	- Filters used: Female/Male distinction
	- Indicators: Evolution of Life expectancy
	
- Dataset 2:
	- Time window: 2001-2023
	- Filters used: None
	- Indicators: Evolution of average retirement age (Pensions de vieillesse et de vieillesse anticipée - Total)
	
- Dataset 3: 
	- Time window: 2001-2023
	- Filters used: None
	- Indicators: Evolution of the number of pensions in luxembourg (yearly average)

- Dataset 4: 
	- Time window: 2001-2023
	- Filters used: No distinction between female/male, totaled on all age groups
	- Indicators: Evolution of total population count

- Dataset 5:
    - Time window: 2020-2025
	- Filters used: Using the most recent data available by municipality
	- Indicators: Distribution by age groups and municipalities

 - Dataset 6:
    - Time window: 2023
	- Filters used: None
	- Indicators: Mapping of Luxembourg by municipalities

 - Dataset 7:
    - Time window: 2023
	- Filters used: None
	- Indicators: % of people at age of 65+ that are living in private homes by themselves

- Joins:
	- Life expectancy, Number of beneficiaries of the pension, Average pension age, Total population number are all joined by year
	- Distribution of age groups by municipalities is joined with the coordinates for each municipality for the coding of the map, aggregation of the age groups above 65, summing of genders to get to a total
- Derived variables: % increase in beneficiaries YOY, % increase in life expectancy by age YOY, % increase in population YOY, % of 65+ year olds versus the total population by municipality, % of 65+ year olds living in private homes by themselves
- No sampling
- No anonymization/pseudonymization needed


## Quality & limitations

- Known gaps:
	- Some gaps in life expectancy in the early 2000s
- Measurement errors: not known
- Model Assumptions: 
	- Considering the predicting indicators, the model assumes that the evolution of the indicators will continue at the average rate of the past 10 years
	- Number of pensions includes the "avances" and "vieillesse anticipée", which could inflate the total number of pensions
- Representativeness: The number of people receiving a pension is calculated versus the total population, excluding from the analysis the population which lives in bordering
	countries, which would have contributed to the pension fund at some point in their life. This implies that simply the number of people is a simplistic view of the persioned population.
- Reproducibility constraints: not known
- Compute Limits: None as aggregated data was used (partly)


## Legal, privacy & ethics

- No personal/confidential data in repo.
- Respect source licenses; cite clearly.
- Risks/harms considered; mitigations (aggregation, thresholds, suppression).

## Reproducibility

- Minimal steps to re-create results from clean sources.
- Deterministic seeds & environment listed in `requirements.txt`/`environment.yml`.
