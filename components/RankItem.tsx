const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type Rank = {
    url: string;
    rank: number;
}

const RankItem: React.FC<Rank> = ({
    url,
    rank
}) => {
    return (
        <div key={url}>{numberWithCommas(rank)} - <a className="text-blue-600" href={`https://${url}`} target="_blank" rel="noopener noreferrer">{url}</a></div>
    )
}

export default RankItem;