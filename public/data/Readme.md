# Datasets Description

## greek-gods.csv

This is the original dataset from the GD Contest 2016

## greek-gods-enrichment.csv

This is the dataset taken from https://github.com/katkaypettitt/greek-gods , used to add `types` and `description` to __greek-gods.csv__

## missing-nodes.txt

This tracks the deities that are present in __greek-gods.csv__ but missing in __greek-gods-enrichment.csv__ , for these entries `types` and `description` have been manually added


## family-tree-dataset.json

The family tree is drawn using the __d3dag__ library which requires a precise data structure to represent graphs

## greek-gods-hierarchy.json

Since the Sunburst diagram represents a tree structure, it is explicitly represented inside this file

## greek-gods-sex.json

Dataset used to draw the piechart

## greek-gods-popularity.csv

Dataset used to draw the barchart