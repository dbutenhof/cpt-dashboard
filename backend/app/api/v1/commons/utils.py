from app.services.search import ElasticService

async def getMetadata(uuid: str, configpath: str) :
    query = {
        "query": {
            "query_string": {
                "query": (
                    f'uuid: "{uuid}"')
            }
        }
    }
    print(query)
    es = ElasticService(configpath=configpath)
    response = await es.post(query)
    await es.close()
    meta = [item['_source'] for item in response["hits"]["hits"]]
    return meta[0]
