# Data Card - interactive graph for life expectancy, average pension age and part of the population receiving pensions

## Sources
- Dataset 1 — STATEC, https://lustat.statec.lu/vis?lc=en&tm=life%20expectancy&pg=0&snb=3&df[ds]=ds-release&df[id]=DF_B2209&df[ag]=LU1&df[vs]=1.0&dq=S01..A&pd=1991%2C2023&to[TIME_PERIOD]=false, Identifier: DF_B2209 — License: https://statistiques.public.lu/en/support/notice.html
- Dataset 2 — inspection générale de la sécurité sociale, https://download.data.public.lu/resources/series-statistiques-sur-les-pensions/20250620-105218/ap-2-145-rg-evoagemoypens-cat.xlsx, version/date — **License:** (e.g., CC0 1.0)
- Dataset 3 - inspection générale de la sécurité sociale, https://data.public.lu/fr/datasets/r/14cc7614-c864-42c8-997e-de52dca22ef5, version/date — **License:** (e.g., CC0 1.0)
- Dataset 4 - STATEC, https://lustat.statec.lu/vis?lc=en&tm=age&pg=0&snb=179&df[ds]=ds-release&df[id]=DF_B1102&df[ag]=LU1&df[vs]=1.0&dq=A..&pd=2014%2C2023&to[TIME_PERIOD]=false&isAvailabilityDisabled=false&lo=1&lom=LASTNOBSERVATIONS, Identifier: DF_B1102 - Licence: https://statistiques.public.lu/en/support/notice.html
- TBD: Dataset 5 - Registre national des personnes physiques RNPP : Pyramide d'âge par commune - population age pyramid per municipality - source: https://data.public.lu/en/datasets/registre-national-des-personnes-physiques-rnpp-pyramide-dage-par-commune-population-age-pyramid-per-municipality/#/resources

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

- Joins: Life expectancy, Number of beneficiaries of the pension, Average pension age, Total population number are all joined by year
- Derived variables: % increase in beneficiaries YOY, % increase in life expectancy by age YOY, % increase in population YOY
- No sampling
- No anonymization/pseudonymization needed


## Quality & limitations

- Known gaps: Some gaps in life expectancy in the early 2000s
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
>>>>>>> Stashed changes
