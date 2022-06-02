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
docker build -t n8n-custom -f docker/images/n8n-custom/Dockerfile .
```

## Run the docker image

Execute the following in the n8n root folder:
```bash
docker run -d -p 5678:5678 n8n-custom
```
You can then access n8n by opening : [http://localhost:5678](http://localhost:5678)

### Lds with Binary Files (.csv)

Video : [](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/Similarity_with_ReadBinaryFile.webm)

You can copy the contents of the [Similarity_with_ReadBinaryFile.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/Similarity_with_ReadBinaryFile.json) and paste it into the workflow.

Double-click on the LsdSimilaryty node. In "Type of measure", click on the gear, then "Add Expression". I will show "Resim" in "Expression" and "Result". You can click on the cross.
You can change "Resource 1" and "Resource 2" with other concepts.
Click on "Back to canvas".

Click on "Execute the workflow"

After the execution, you can download the result by doucble-clicking on the Write Binary File node, then "Download".

For now, you can only keep one comparasion by csv file.

### Lds with Google Sheets

Video : [](https://github.com/Eli6a/n8n/blob/master/workflow-examples/video-examples/LdsSimilarity_DatasetMain.webm)

You can copy the contents of the [LdsSimilarity_DatasetMain.json](https://github.com/Eli6a/n8n/blob/master/workflow-examples/LdsSimilarity_DatasetMain.json) and paste it into the workflow.

As we need to yse credentials, follow this [tutorial](https://docs.n8n.io/integrations/credentials/google/) te create the credentials. Service Account is enough for this example.
When it's done, create two Google Sheets files, and copy their IDs in the node Set Input Output Files IDs.
The input file can be empty, but the output one must have, at least, the colomns : "resource1", "resource2" and "score". 
Their IDs can be find on your file's url : ht<span>tps//docs.google.</span>com/spreadsheets/d/<span>[the-ID]/edit#gid=0</span>
Click on "Back to canvas".

Double-click on the LsdSimilaryty node. In "Type of measure", click on the gear, then "Add Expression". I will show "Resim" in "Expression" and "Result". You can click on the cross.
You can change "Resource 1" and "Resource 2" with other concepts.
Click on "Back to canvas".

Click on "Execute the workflow"

After the execution, your output file will be update with the name of the concepts and the score of similarity. 
If the workflow is execute again, a new row will appear.

## Close n8n

Execute the command :
```bash
docker ps
```

Copy the Container ID of n8n-custom.

Execute the command :
```bash
docker stop [ContainerID]
```
