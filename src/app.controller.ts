import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IpfsService } from './ipfs/ipfs.service';
import { CraftNftDto } from './dtos/craft-nft.dto';
import { IpfsResponse } from './entities/ipfs-response.entity';
import { MAX_NFT_ITEM } from './constants';
import { NftContractService } from './nft-contract/nft-contract.service';
import { Field } from 'o1js';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { MarketItem } from './schemas/market-item.schema';
import { Model } from 'mongoose';
import { NftMetadata } from './schemas/nft-metadata.schema';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly ipfsService: IpfsService,
        private readonly nftContractService: NftContractService,
        @InjectModel(MarketItem.name)
        private readonly marketItemModel: Model<MarketItem>,
        @InjectModel(NftMetadata.name)
        private readonly nftMetadataModel: Model<NftMetadata>,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @ApiTags('Witness')
    @Get('/witness/owner/:id')
    async getOwnerWitness(@Query('id') id: number) {
        if (id < 0 || id >= MAX_NFT_ITEM) {
            throw new BadRequestException();
        } else {
            return this.nftContractService.ownerStorage.getWitness(Field(id));
        }
    }

    @ApiTags('Witness')
    @Get('/witness/price/:id')
    async getPriceWitness(@Query('id') id: number) {
        if (id < 0 || id >= MAX_NFT_ITEM) {
            throw new BadRequestException();
        } else {
            return this.nftContractService.priceStorage.getWitness(Field(id));
        }
    }

    @ApiTags('Witness')
    @Get('/witness/ipfs-hash/:id')
    async getIpfsHashWitness(@Query('id') id: number) {
        if (id < 0 || id >= MAX_NFT_ITEM) {
            throw new BadRequestException();
        } else {
            return this.nftContractService.ipfsHashStorage.getWitness(
                Field(id),
            );
        }
    }

    @ApiTags('Leaf')
    @Get('/leafs/owner')
    async getOwnerLeafs() {
        return this.nftContractService.ownerStorage.leafs;
    }

    @ApiTags('Leaf')
    @Get('/leafs/price')
    async getPriceLeafs() {
        return this.nftContractService.priceStorage.leafs;
    }

    @ApiTags('Leaf')
    @Get('/leafs/ipfs-hash')
    async getIpfsHashLeafs() {
        return this.nftContractService.ipfsHashStorage.leafs;
    }

    @ApiTags('Market')
    @Get('/market/items')
    async getMarketItems(): Promise<MarketItem[]> {
        return this.marketItemModel.find({
            price: { $gt: 0 },
        });
    }

    @ApiTags('NFT')
    @Get('/nft/metadata')
    async getNftMetadatas(): Promise<NftMetadata[]> {
        return this.nftMetadataModel.find({});
    }

    @ApiTags('NFT')
    @Get('/nft/ipfs-data/:ipfsHash')
    async getIpfsData(@Query('ipfsHash') ipfsHash: string) {
        return this.ipfsService.getData(ipfsHash);
    }

    @ApiTags('NFT')
    @Post('/nft/craft')
    async craftNft(@Body() craftNftDto: CraftNftDto): Promise<IpfsResponse> {
        return await this.ipfsService.uploadJson(craftNftDto);
    }
}
