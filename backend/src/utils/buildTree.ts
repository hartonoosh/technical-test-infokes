export function buildTree(items: any[]){
    const map   : any = {}
    const roots : any[] = []

    items.forEach(item => (map[item.id] = {...item, children:[]}))

    items.forEach(item => {
        if(item.parent_id === null){
            roots.push(map[item.id])
        } else {
            map[item.parent_id].children.push(map[item.id])
        }
    })
    

    console.log(roots)
    return roots
}