# Lds

Lds (Linked Data Similarity) is a Java Library that make similarity calculation between concepts.
We use n8n to facilitate it use and exploit it result.

# Lds usage with custom nodes and docker

The command should be used on a Linux terminal

## Before building the docker image

To use Binary File nodes, you must put the writting permission to [output.csv](https://github.com/Eli6a/n8n/blob/master/lds-files/output.csv), located in the folder lds-files, to be able to use it with the Write Binary File node using this command in the n8n root folder :
```bash
chmod o+w lds-files/output.csv
```

## Building the docker image

Execute the following in the n8n root folder:
```bash
docker build -t n8n_with_lds -f docker/images/n8n-custom/Dockerfile .
```

## Run n8n and Lds Micro services

To be able to use the Lds nodes, go to n8n/docker/compose/withLdsMicroServices with the command :
```bash
cd /docker/compose/withLdsMicroServices
```
And execute :
```bash
sudo docker-compose up -d
```

Then, you can access n8n by opening : [http://localhost:5678](http://localhost:5678)

### Lds with Binary Files (.csv)

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_with_ReadBinaryFile.gif)
([mp4 version](https://raw.githubusercontent.com/Eli6a/n8n/master/workflow-examples/video-examples/LdsSimilarity_with_ReadBinaryFile.mp4))

You can copy the contents of [Similarity_with_ReadBinaryFile.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/Similarity_with_ReadBinaryFile.json) and paste it into the workflow.

To change the type of the measure, or the concepts to compare, double-click on the LsdSimilarity node, 
and when it's done, click on "Back to canvas".

Click on "Execute the workflow"

After the execution, you can download the result by doucble-clicking on the Write Binary File node, then "Download".

For now, you can only keep one comparasion by csv file.

### Lds with Google Sheets

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_DatasetMain.gif)
([mp4 version](https://raw.githubusercontent.com/Eli6a/n8n/master/workflow-examples/video-examples/LdsSimilarity_DatasetMain.mp4))

You can copy the contents of [LdsSimilarity_DatasetMain.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/LdsSimilarity_DatasetMain.json) and paste it into the workflow.

As we need to use credentials, follow this [tutorial](https://docs.n8n.io/integrations/credentials/google/) to create the credentials. Service Account is enough for this example.
When it's done, create two Google Sheets files, and copy their IDs in the node Set Input Output Files IDs.
The input file can be empty, but the output one must have, at least, the colomns : "resource1", "resource2" and "score". 
Their IDs can be find on your file's url : ht<span>tps//docs.google.</span>com/spreadsheets/d/<span>[the-ID]/edit#gid=0</span>
Click on "Back to canvas".

To change the type of the measure, or the concepts to compare, double-click on the LsdSimilarity node, 
and when it's done, click on "Back to canvas".

Click on "Execute the workflow"

After the execution, your output file will be updated with the name of the two concepts and their score of similarity. 
If the workflow is executed again, a new row will appear.

### Lds MicroMeasure

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsMicroMeasure.gif)
([mp4 version](https://raw.githubusercontent.com/Eli6a/n8n/master/workflow-examples/video-examples/LdsMicroMeasure.mp4))

You can copy the contents of [LdsMicroMeasure.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/LdsMicroMeasure.json) and paste it into the workflow.

You can add more LdsMicroMeasure nodes by linking a LdsDataset node on the top (the LdsDataset can be linked to several nodes) and another LdsMicroMeasure node at the bottom.
To change the propriety to compare, double-click on the LdsMicroMeasure node, 
and when it's done, click on "Back to canvas".

LdsMicroMeasureAggregation node is the node that will return the average, the minimum or the maximum of the scores given by the LdsMicroMeasure nodes, according to the option you choose.

Click on "Execute the workflow"

Double-click on the LdsMicroMeasureAggregation node to see the result.

## Stop n8n and Lds Micro services

Place yourself in n8n/docker/compose/withLdsMicroServices if it's not already the case and execute the command :
```bash
sudo docker-compose up -d
```

## Note

If there is changes with Lds Services, you may need to change :
- the images in [n8n/docker/compose/docker-compose.yml](https://github.com/Eli6a/n8n/blob/master/docker/compose/withLdsMicroServices/docker-compose.yml)
- the uri to these services in :
				- [packages/nodes-base/nodes/LdsSimilarity/LdsSimilarity.node.ts ](https://github.com/Eli6a/n8n/blob/master/packages/nodes-base/nodes/LdsSimilarity/LdsSimilarity.node.ts), lines 242 and 297
				- [packages/nodes-base/nodes/LdsMicroMeasure/LdsMicroMeasure.node.ts](https://github.com/Eli6a/n8n/blob/master/packages/nodes-base/nodes/LdsMicroMeasure/LdsMicroMeasure.node.ts), lines 125 and 190

