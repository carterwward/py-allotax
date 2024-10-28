# ALLotaxonometry for all: Open-source intuitive interactive implementation of the allotaxonometer for widespread public use

The primary purpose of the alloxonometer in general is to calculate and visualize the difference between any two Zipfian ranked lists of components. This package provides the utilities to facilitate the creationg of the allotaxonometer in `d3.js`

## CSV input

The allotaxonometer expects 2 tables in the following form:

|    | types   |   counts |   totalunique |   probs |
|----|---------|----------|---------------|---------|
|  0 | John    |     8502 |          1161 |  0.0766 |
|  1 | William |     7494 |          1161 |  0.0675 |
|  2 | James   |     5097 |          1161 |  0.0459 |
|  3 | George  |     4458 |          1161 |  0.0402 |
|  4 | Charles |     4061 |          1161 |  0.0366 |

## Layers of meaning


<p>
<img width="100%" alt="Screenshot 2024-10-14 at 7 03 01 AM" src="https://github.com/user-attachments/assets/9a98d4e5-7a11-47ad-8d71-5424de755daa">
<figcaption>FIG 1 - https://arxiv.org/pdf/2002.09770</figcaption>
</p>

 - [x] A. Legend bin rank-rank pairs
 - [x] B. Types at the top of the diamond rank high for both systems
 - [x] C. Moving down, turbulence starts to become noticeable around $r = 10^2$
 - [x] D. Other types that are becoming significant
 - [x] E. Separated lines and points at the bottom of the histogram arise from logarithmic spacing
 - [x] F. Least important and least differentiating types appear at the bottom of the histogram
 - [x] G. Balances at the bottom right of the rank-rank histogram.
 - [x] H,I,J. show examples of three extremes of how systems might compare on rank-rank histograms

<p>
<img width="100%" alt="Fig2" src="https://github.com/user-attachments/assets/69dd9029-eacc-4b12-84eb-fca01bf40491">
<figcaption>FIG 2 - https://arxiv.org/pdf/2002.09770</figcaption>
</p>

 - [x] A. Choosing the scale of the instrument
 - [x] B. Contour lines to track $\alpha$
 - [ ] C.a. Inset showing the contour lines
 - [x] C.b. Opacity of types proportional to instrument score
 - [x] D. Top words ranked according to divergence contribution  (Rank System 1 ⇋ Rank System 2)
 - [ ] E. Exclusive types indicated by a directed open triangle
 - [ ] F. Percentage contribution to th divergence score from each system

## Paper data

#### Babynames data

The original babyname dataset for boys and girls can be found on the [catalog.data.gov](https://catalog.data.gov/dataset?tags=baby-names) website. But we use the dataset [here](http://pdodds.w3.uvm.edu/permanent-share/pocs-babynames.zip) to replicate the original paper. You can find a 5-years aggregated version used in the `Observable` version in `data/`. The original dataset includes each year from 1880–2018, which have 5 or more applications. You can convert the original folder into the formatted `.json` file using R with the following command:

```R
read_and_write_babyname_dat <- function(fname, gender) {
  d <- readr::read_csv(fname, 
                       col_names = c("types", "gender", "counts"), 
                       col_select = c("types", "counts"),
                       col_types = c("c", "i"))
  
  d$probs <- d$counts / sum(d$counts)
  d$total_unique <- nrow(d)
  return(d)
}
# You need to be in the folder above `data/`, which is the unzip folder contained in 
# http://pdodds.w3.uvm.edu/permanent-share/pocs-babynames.zip
purrr::map(
  list.files("data/", pattern = "names-boys*"), 
  ~read_and_write_babyname_dat(paste("data", .x, sep = "/"), "boys")
)

purrr::map(
  list.files("data/", pattern = "names-girls*"), 
  ~read_and_write_babyname_dat(paste("data", .x, sep = "/"), "girls")
)
```

#### Twitter data

We access the Twitter data from the Comptuational Story Lab [storywrangling](https://gitlab.com/compstorylab/storywrangling)' API. Unfortunately, the API only work when you are connected on the University of Vermont's VPN. Follow the instructions [here](https://www.uvm.edu/it/kb/article/install-cisco-vpn/) to get the VPN working. Once this is done, run the following lines from the command line:

```shell
git clone https://gitlab.com/compstorylab/storywrangling.git
cd storywrangling
pip install -e .
```

Then from `python` you can get the top ngram count with rank data for any given day with the following:

```python
from storywrangling import Storywrangler
from datetime import datetime
import json
from pathlib import Path

def get_ngram(yr, month, day, fname=False):
    storywrangler = Storywrangler()
    ngram_zipf = storywrangler.get_zipf_dist(
        date=datetime(yr, month, day),
        lang="en", ngrams="1grams",
        max_rank=10000, rt=False
    ).reset_index()\
     .rename(columns={
        "ngram":"types", "count":"counts", "count_no_rt":"counts_no_rt",
        "rank":"rank", "rank_no_rt":"rank_no_rt", "freq":"probs", "freq_no_rt":"probs_no_rt"
        })\
     .dropna()\
     .assign(totalunique = lambda x: x.shape[0])\
     .loc[:, ["types", "counts", "totalunique", "probs"]]\
     .to_dict(orient="index")

    ngram_zipf = { f"{yr}_{month}_{day}": [_ for _ in ngram_zipf.values()] }

    if fname:
        if Path(fname).exists():
            with open(fname) as f:
                old_dat = json.load(f)
            
            ngram_zipf.update(old_dat)

        with open(fname, 'w') as f:
            json.dump(ngram_zipf, f)
    else:
       return ngram_zipf
```

Note that this solution is a bit clunky. At some point we would prefer to have a sql DB that we can interact with. 

#### Species Abundance Data

We access the species abundance data from https://datadryad.org/stash/dataset/doi:10.15146/5xcp-0d46, downloading the full dataset, unzipping it, and then loading bci.tree\<i\>.rdata for i in (1-8), as well as bci.spptable.rdata. We then run the following code to subset the full census represented by each of the bci.tree\<i\>.rdata to get the counts of the species of the trees alive during that census, combine merge that with the species name database to get the full name, and then put it in the format that our allotaxonometer code expects:

```r    
library(Sys)
library(dplyr)
library("rlist")
library(jsonlite)

tree_data <- vector("list", length=8)



dfs = list(bci.tree1, bci.tree2, bci.tree3, bci.tree4,  bci.tree5, bci.tree6, bci.tree7, bci.tree8)


for (i in seq_along(dfs)) {
  print(i)
  full_census <- merge(dfs[[i]], bci.spptable, by='sp') 
  alive_census <-full_census[full_census$status %in% c('A','AD'),] # A='Alive', AD='A seldom-used code, applied when a tree was noted as dead in one census but was found alive in a later census. For most purposes, this code should be interpreted the same as code A for alive.'
  count_df <- dplyr::count(alive_census, Latin, sort = TRUE)
  names(count_df)[names(count_df) == 'Latin'] <- 'types'
  names(count_df)[names(count_df) == 'n'] <- 'counts'
  count_df['totalunique'] <- nrow(count_df)
  count_df['probs']<-count_df['counts'] / nrow(alive_census)
  tree_data[[i]] <- count_df
}

names(tree_data) <- c("1981-1983", "1985", "1991-1992", "1995-1996", "2000-2001", "2005-2006", "2010-2011", "2013-2015")

exportJson <- toJSON(tree_data)
write(exportJson, "tree_species_counts.json")
```
