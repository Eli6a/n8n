# Lds

Lds (Linked Data Similarity) is a Java Library that make similarity calculation between concepts.</br>
We use n8n to facilitate it use and exploit it results.

# Lds usage with custom nodes and docker

You need to install docker and docker-compose to use Lds services. If it is not already done, you can follow the 3 first points of [this tutorial](https://docs.n8n.io/hosting/server-setups/docker-compose/).

You also need to clone this reposotory (or download it) and place yourself into the n8n directory with your terminal.

The command should be used on a Linux terminal

## Building the docker image

Execute the following in the n8n root folder:
```bash
docker build -t n8n_with_lds -f docker/images/n8n-custom/Dockerfile .
```

## Run n8n and Lds Micro services

To be able to use the Lds nodes, go to n8n/docker/compose/withLdsMicroServices with the command :
```bash
cd docker/compose/withLdsMicroServices
```
And execute :
```bash
docker-compose up -d
```

Then, you can access n8n by opening : [http://localhost:5678](http://localhost:5678)</br>
(It may take a few seconds before it is accessible)

You can skip the "Set up owner account".

### Lds with Binary Files (.csv)

#### Before running n8n and Lds Micro services

Before running n8n and Lds, you may have to change "~/n8n/lds-files", line 52 of the [docker-compose.yml](https://github.com/Eli6a/n8n/blob/master/docker/compose/withLdsMicroServices/docker-compose.yml), with the path where lds-files is in your computer (depending on where you have clone this n8n repository) 

You must put the writting permission to [output.csv](https://github.com/Eli6a/n8n/blob/master/lds-files/output.csv), located in the folder lds-files, to be able to use it with the Write Binary File node using this command in the n8n root folder :
```bash
chmod o+w lds-files/output.csv
```
This command can be use while n8n is running.

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_with_ReadBinaryFile_single_comparison.gif)
([mp4 version](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_with_ReadBinaryFile_single_comparison.mp4))

You can copy the contents of [Similarity_with_ReadBinaryFile_single_comparison.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/Similarity_with_ReadBinaryFile_single_comparison.json) and paste it into the workflow.

To change the type of the measure, or the concepts to compare, double-click on the LsdSimilarity node, 
and when it's done, click on "Back to canvas".

Click on "Execute the workflow"

After the execution, [output.csv](https://github.com/Eli6a/n8n/blob/master/lds-files/output.csv) will be overwritten. If there is data in [input.csv](https://github.com/Eli6a/n8n/blob/master/lds-files/input.csv), output.csv will include them.</br>
You can also download a copy by double-clicking the Write Binary File, then "Download".</br>
If you want to run several time the workflow, you should put output.csv as an input file, in the Set Input Output Files Paths node, so it update itself.

If you have prepared the input.csv with some concept to compare, you can use [this workflow](https://github.com/Eli6a/n8n/blob/master/workflow-examples/Similarity_with_ReadBinaryFile.json) instead. You would just have to execute the workflow.

### Lds with Google Sheets

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_DatasetMain.gif)
([mp4 version](https://raw.githubusercontent.com/Eli6a/n8n/master/workflow-examples/video-examples/LdsSimilarity_DatasetMain.mp4))

You can copy the contents of [LdsSimilarity_DatasetMain.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/LdsSimilarity_DatasetMain.json) and paste it into the workflow.

As we need to use credentials, follow this [tutorial](https://docs.n8n.io/integrations/credentials/google/) to create the credentials. Service Account is enough for this example.

When it's done, create two Google Sheets files, and copy their IDs in the node Set Input Output Files IDs.</br>
The input file can be empty, but the output one must have, at least, the colomns : "resource1", "resource2" and "score". </br>
Their IDs can be find on your file's url : ht<span>tps//docs.google.</span>com/spreadsheets/d/<span>**[the-ID]**/edit#gid=0</span>

Click on "Back to canvas".

To change the type of the measure, or the concepts to compare, double-click on the LsdSimilarity node, 
and when it's done, click on "Back to canvas".

Click on "Execute the workflow"

After the execution, your output file will be updated with the name of the two concepts and their score of similarity. </br>
If the workflow is executed again, a new row will appear.

### Lds MicroMeasure

Video : ![](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsMicroMeasure.gif)
([mp4 version](https://raw.githubusercontent.com/Eli6a/n8n/master/workflow-examples/video-examples/LdsMicroMeasure.mp4))

You can copy the contents of [LdsMicroMeasure.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/LdsMicroMeasure.json) and paste it into the workflow.

You can add more LdsMicroMeasure nodes by linking a LdsDataset node on the top (the LdsDataset can be linked to several nodes) and another LdsMicroMeasure node at the bottom.

To change the propriety to compare, double-click on the LdsMicroMeasure node, </br>
and when it's done, click on "Back to canvas".

LdsMicroMeasureAggregation node is the node that will return the average, the minimum or the maximum of the scores given by the LdsMicroMeasure nodes, according to the option you choose.

Click on "Execute the workflow"

Double-click on the LdsMicroMeasureAggregation node to see the result.

## Stop n8n and Lds Micro services

Place yourself in n8n/docker/compose/withLdsMicroServices if it's not already the case and execute the command :
```bash
docker-compose down
```

## Note

If there is changes with Lds Services, you may need to change :
- the images in [n8n/docker/compose/docker-compose.yml](https://github.com/Eli6a/n8n/blob/master/docker/compose/withLdsMicroServices/docker-compose.yml)
- the uri to these services in :</br>
				- [packages/nodes-base/nodes/LdsSimilarity/LdsSimilarity.node.ts ](https://github.com/Eli6a/n8n/blob/master/packages/nodes-base/nodes/LdsSimilarity/LdsSimilarity.node.ts), lines 242 and 297</br>
				- [packages/nodes-base/nodes/LdsMicroMeasure/LdsMicroMeasure.node.ts](https://github.com/Eli6a/n8n/blob/master/packages/nodes-base/nodes/LdsMicroMeasure/LdsMicroMeasure.node.ts), lines 125 and 190

